import { Component, OnInit, inject, signal, WritableSignal, computed } from '@angular/core';
import { Post } from '../../../services/post';
import { GetPostsResponse, PostModel } from '../../../models/postModels';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './explore.html',
})
export class Explore implements OnInit {
  private _postService = inject(Post);

  postsList: WritableSignal<PostModel[]> = signal([]);

  location = signal('');
  propertyType = signal('');
  priceRange = signal('');

  filteredPosts = computed(() => {
    return this.postsList().filter((post) => {
      const locationMatch =
        !this.location() || post.title?.toLowerCase().includes(this.location().toLowerCase());

      const typeMatch = !this.propertyType() || post.propertyType === this.propertyType();

      const priceMatch = this.priceMatches(post.price);

      return locationMatch && typeMatch && priceMatch;
    });
  });
  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this._postService.getAllPosts().subscribe({
      next: (res: GetPostsResponse) => {
        console.log(res);
        if (res.data) this.postsList.set(res.data);
      },
      error: () => console.error('Failed to load posts'),
    });
  }

  private priceMatches(price: number): boolean {
    const range = this.priceRange();

    if (!range) return true;

    if (range === '5000+') return price > 5000;

    const [minStr, maxStr] = range.split('-');
    console.log('+minStr, +maxStr');
    return price >= +minStr && price <= +maxStr;
  }

  resetFilters() {
    this.location.set('');
    this.propertyType.set('');
    this.priceRange.set('');
  }
}
