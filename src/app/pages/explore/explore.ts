import { Component, OnInit, inject, signal, WritableSignal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Post } from '../../services/post';
import { GetPostsResponse, PostModel } from '../../models/postModels';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './explore.html',
})
export class Explore implements OnInit {
  private _postService = inject(Post);
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
      const locationMatch = !search || post.address?.toLowerCase().includes(search);
      const typeMatch = !type || post.propertyType === type;
      const priceMatch = this.priceMatches(post.price, priceFilter);

      return locationMatch && typeMatch && priceMatch;
    });
  });

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.isLoading.set(true);
    this.serverErrorMsg.set('');

    this._postService.getAllPosts().subscribe({
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
}
