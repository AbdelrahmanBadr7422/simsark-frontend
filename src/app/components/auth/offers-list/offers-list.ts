import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Offer } from '../../../services/offer';
import {
  GetPostOffersResponse,
  RespondToOfferResponse,
} from '../../../models/offerModels';

@Component({
  selector: 'app-offers-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './offers-list.html',
})
export class OffersList implements OnInit {
  private offerService = inject(Offer);
  private route = inject(ActivatedRoute);

  offers = signal<GetPostOffersResponse>([]);
  isLoading = signal(true);
  hasError = signal(false);

  ngOnInit(): void {
    this.displayPost();
  }

  private displayPost(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const postId = paramMap.get('postId');
      if (postId) this.fetchOffers(postId);
      else {
        this.isLoading.set(false);
        this.hasError.set(true);
      }
    });
  }

  private fetchOffers(postId: string) {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.offerService.getAllOffersForPost(postId).subscribe({
      next: (res: GetPostOffersResponse) => {
        this.offers.set(res);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.hasError.set(true);
      },
    });
  }

  removeOffer(id: string) {
    this.offers.update((list) => list.filter((o) => o._id !== id));
  }

  /** ✅ Respond with backend call + live UI update */
  acceptOffer(id: string) {
    this.offerService.respondToOffer({ action: 'ACCEPTED' }).subscribe({
      next: (res: RespondToOfferResponse) => {
        this.offers.update((list) =>
          list.map((offer) =>
            offer._id === id ? { ...offer, status: res.data.status } : offer
          )
        );
      },
      error: () => {
        alert('Failed to accept offer. Please try again.');
      },
    });
  }

  rejectOffer(id: string) {
    this.offerService.respondToOffer( { action: 'REJECTED' }).subscribe({
      next: (res: RespondToOfferResponse) => {
        this.offers.update((list) =>
          list.map((offer) =>
            offer._id === id ? { ...offer, status: res.data.status } : offer
          )
        );
      },
      error: () => {
        alert('Failed to reject offer. Please try again.');
      },
    });
  }
}
