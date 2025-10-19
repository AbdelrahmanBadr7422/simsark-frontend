import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Post } from '../../services/post';
import { Payment } from '../../components/shared/payment/payment';
import {
  CreatePostRequest,
  DeletePostResponse,
  GetPostByIdResponse,
  PostModel,
  UpdatePostResponse,
} from '../../models/postModels';

@Component({
  selector: 'app-post-details',
  standalone: true,
  imports: [CommonModule, DatePipe, Payment, ReactiveFormsModule],
  templateUrl: './post-details.html',
})
export class PostDetails implements OnInit, OnDestroy {
  private postService = inject(Post);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private destroy$ = new Subject<void>();

  currentPost?: PostModel;
  isLoading = true;
  hasError = false;
  postOwner = false;

  showDeleteConfirm = false;
  showEditModal = false;
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  updateForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    price: [0, [Validators.required, Validators.min(1)]],
    area: [0, [Validators.required, Validators.min(1)]],
    rooms: [0, [Validators.required, Validators.min(1)]],
    bathrooms: [0, [Validators.required, Validators.min(1)]],
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

          this.updateForm.patchValue({
            title: this.currentPost.title,
            description: this.currentPost.description,
            price: this.currentPost.price,
            area: this.currentPost.area,
            rooms: this.currentPost.rooms,
            bathrooms: this.currentPost.bathrooms,
          });
        },
        error: () => {
          this.hasError = true;
          this.isLoading = false;
        },
      });
  }

  // --- DELETE HANDLING ---
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
        error: () => this.showToastMessage('Failed to delete post ❌', 'error'),
      });
  }

  // --- EDIT HANDLING ---
  openEditModal() {
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
  }

  savePostUpdate() {
    if (this.updateForm.invalid || !this.currentPost) return;

    const body: CreatePostRequest = {
      title: this.updateForm.value.title!,
      description: this.updateForm.value.description!,
      price: Number(this.updateForm.value.price!),
      area: Number(this.updateForm.value.area!),
      rooms: Number(this.updateForm.value.rooms!),
      bathrooms: Number(this.updateForm.value.bathrooms!),
      propertyType: this.currentPost.propertyType,
    };

    this.postService
      .updatePost(this.currentPost._id, body)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: UpdatePostResponse) => {
          this.currentPost = res.data;
          this.showEditModal = false;
          this.showToastMessage('✅ Post updated successfully!', 'success');
        },
        error: () => this.showToastMessage('Failed to update post ❌', 'error'),
      });
  }

  // --- TOAST HANDLER ---
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
