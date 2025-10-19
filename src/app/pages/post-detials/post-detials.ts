import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../../services/post';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GetPostByIdResponse, PostModel } from '../../models/postModels';
import { DatePipe } from '@angular/common';
import { Payment } from '../../components/shared/payment/payment';

@Component({
  selector: 'app-post-details',
  standalone: true,
  imports: [DatePipe, Payment],
  templateUrl: './post-detials.html',
})
export class PostDetails implements OnInit, OnDestroy {
  private postService = inject(Post);
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();

  currentPost?: PostModel;
  isLoading = true;
  hasError = false;

  ngOnInit(): void {
    this.displayPost();
  }

  private displayPost(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((paramMap) => {
      const postId = paramMap.get('postId');
      if (postId) {
        this.fetchPostDetails(postId);
      } else {
        this.isLoading = false;
        this.hasError = true;
        console.warn('No post ID found in route.');
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
        },
        error: (err) => {
          console.error('Error fetching post details:', err);
          this.hasError = true;
          this.isLoading = false;
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
