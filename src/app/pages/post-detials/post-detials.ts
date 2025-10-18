import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../../services/post';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GetPostByIdResponse, PostModel } from '../../models/postModels';
import { JsonPipe,DatePipe } from '@angular/common';
import { Payment } from '../../components/shared/payment/payment';

@Component({
  selector: 'app-post-detials',
  imports: [JsonPipe,DatePipe, Payment],
  templateUrl: './post-detials.html',
})
export class PostDetails implements OnInit, OnDestroy {
  private postService = inject(Post);
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();

  currentId: string = '';
  currentPost?: PostModel;

  ngOnInit(): void {
    this.displayPost();
  }

  private displayPost(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((paramMap) => {
      const postId = paramMap.get('postId');
      if (postId) {
        this.currentId = postId;
        this.fetchPostDetails(postId);
      } else {
        console.warn('No post ID found in route.');
      }
    });
  }

  private fetchPostDetails(postId: string): void {
    this.postService
      .getSinglePost(postId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: GetPostByIdResponse) => {
          this.currentPost = response.data;
        },
        error: (err) => {
          console.error('Error fetching post details:', err);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
