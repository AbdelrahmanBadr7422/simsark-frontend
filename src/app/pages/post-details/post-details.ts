import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule, DatePipe, JsonPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Offer } from '../../services/offer';
import { Post } from '../../services/post';
import { Payment } from '../../components/shared/payment/payment';
import {
  CreatePostRequest,
  GetPostByIdResponse,
  UpdatePostResponse,
} from '../../models/postModels';
import { CreateOfferRequest, CreateOfferResponse } from '../../models/offerModels';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-post-details',
  standalone: true,
  imports: [CommonModule, DatePipe, Payment, ReactiveFormsModule, RouterLink],
  templateUrl: './post-details.html',
})
export class PostDetails implements OnInit, OnDestroy {
  private postService = inject(Post);
  private offerService = inject(Offer);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private destroy$ = new Subject<void>();
  private _router = inject(Router);

  isLogged = localStorage.getItem('authToken') != null;
  currentPost: any;
  isLoading = true;
  hasError = false;
  postOwner = false;

  showDeleteConfirm = false;
  showEditModal = false;
  showOfferModal = false;
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  updateForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    address: ['', [Validators.required, Validators.minLength(5)]],
    price: [0, [Validators.required, Validators.min(1)]],
    area: [0, [Validators.required, Validators.min(1)]],
    rooms: [0, [Validators.required, Validators.min(1)]],
    bathrooms: [0, [Validators.required, Validators.min(1)]],
  });

  offerForm = this.fb.group({
    amount: [0, [Validators.required, Validators.min(1)]],
    message: ['', [Validators.required, Validators.minLength(5)]],
  });

  ngOnInit(): void {
    this.displayPost();
  }

  private displayPost(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((paramMap) => {
      const postId = paramMap.get('postId');
      if (postId) this.fetchPostDetails(postId);
      else {
        this.isLoading = false;
        this.hasError = true;
      }
    });
  }

  private fetchPostDetails(postId: string): void {
    this.isLoading = true;
    this.hasError = false;

    this.postService
      .getSinglePost(postId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: GetPostByIdResponse) => {
          this.currentPost = response.data;
          this.isLoading = false;
          const userId = localStorage.getItem('userData');
          this.postOwner = !!userId && userId.includes(this.currentPost.owner._id);
          this.updateForm.patchValue(this.currentPost);
        },
        error: () => {
          this.hasError = true;
          this.isLoading = false;
        },
      });
  }

  openOfferModal() {
    if (!this.isLogged) {
      this._router.navigate(['/auth/login']);
    } else this.showOfferModal = true;
  }

  closeOfferModal() {
    this.showOfferModal = false;
  }

  submitOffer() {
    if (this.offerForm.invalid || !this.currentPost) return;

    const offer: CreateOfferRequest = {
      postId: this.currentPost._id,
      amount: this.offerForm.value.amount!,
      message: this.offerForm.value.message!,
    };

    this.offerService.addOfferService(offer).subscribe({
      next: (res: CreateOfferResponse) => {
        this.showOfferModal = false;
        this.showToastMessage(' Offer sent successfully!', 'success');
      },
      error: () => this.showToastMessage('Failed to send offer', 'error'),
    });
  }

  confirmDelete() {
    this.showDeleteConfirm = true;
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
  }

  deletePost() {
    if (!this.currentPost) return;
    this.postService
      .deletePost(this.currentPost._id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.showDeleteConfirm = false;
          this.showToastMessage('Post deleted successfully 🗑️', 'success');
          setTimeout(() => window.history.back(), 1500);
        },
        error: () => this.showToastMessage('Failed to delete post ', 'error'),
      });
  }

  openEditModal() {
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
  }

  savePostUpdate() {
    if (this.updateForm.invalid || !this.currentPost) return;
    const body: CreatePostRequest = {
      ...this.updateForm.value,
      propertyType: this.currentPost.propertyType,
    } as any;
    this.postService
      .updatePost(this.currentPost._id, body)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: UpdatePostResponse) => {
          this.currentPost = res.data;
          this.showEditModal = false;
          this.showToastMessage(' Post updated successfully!', 'success');
        },
        error: () => this.showToastMessage('Failed to update post ', 'error'),
      });
  }

  private showToastMessage(msg: string, type: 'success' | 'error') {
    this.toastMessage = msg;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => (this.showToast = false), 2500);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
