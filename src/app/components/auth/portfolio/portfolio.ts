import { Component, computed, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { Post } from '../../../services/post';
import { PostModel, GetPostsResponse } from '../../../models/postModels';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-portfolio',
  imports: [RouterLink],
  templateUrl: './portfolio.html',
  styles: ``,
})
export class Portfolio implements OnInit,OnDestroy {
  private _postService = inject(Post);
  private destroy$ = new Subject<void>();

  postsList: WritableSignal<PostModel[]> = signal([]);
  isLoading = signal(true);
  serverErrorMsg = signal('');

  location = signal('');
  propertyType = signal('');
  priceRange = signal('');

  filteredPosts = computed(() => {
    const search = this.location().toLowerCase();
    const type = this.propertyType();
    const priceFilter = this.priceRange();

    return this.postsList().filter((post) => {
      const locationMatch = !search || post.title?.toLowerCase().includes(search);
      const typeMatch = !type || post.propertyType === type;
      const priceMatch = this.priceMatches(post.price, priceFilter);

      return locationMatch && typeMatch && priceMatch;
    });
  });

  ngOnInit() {
    this.loadPostsforPortfolio();
  }

  loadPostsforPortfolio() {
    this.isLoading.set(true);
    this.serverErrorMsg.set('');
    const userData = localStorage.getItem('userData');
    const ownerId = userData ? JSON.parse(userData)._id : null;
    this._postService
      .getPostsByOwner(ownerId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: GetPostsResponse) => {
          this.isLoading.set(false);
          if (res.data && res.success) {
            this.postsList.set(res.data);
          } else {
            this.serverErrorMsg.set('No posts found.');
          }
        },
        error: () => {
          this.isLoading.set(false);
          this.serverErrorMsg.set('Failed to load posts. Please try again.');
        },
      });
  }

  private priceMatches(price: number, range: string): boolean {
    if (!range) return true;

    if (range === '5000+') return price > 5000;

    const [min, max] = range.split('-').map((n) => +n);
    return price >= min && price <= max;
  }

  resetFilters() {
    this.location.set('');
    this.propertyType.set('');
    this.priceRange.set('');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
