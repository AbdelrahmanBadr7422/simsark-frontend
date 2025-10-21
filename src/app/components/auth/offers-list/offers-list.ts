import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Offer } from '../../../services/offer';
import {
  Offer as OfferModel,
  OfferStatus,
  UserSummary,
  GetPostOffersResponse,
  RespondToOfferResponse,
  SellerOffersResponse,
  CustomerOffersResponse,
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

  offers = signal<OfferModel[]>([]);
  isLoading = signal(true);
  hasError = signal(false);

  ngOnInit(): void {
    this.displayPost();
  }

  private displayPost(): void {
  this.route.paramMap.subscribe((paramMap) => {
    const postId = paramMap.get('postId');

    if (postId) {
      // ✅ If postId exists → get offers for a specific post
      this.fetchOffers(postId);
    } else {
      // ✅ Otherwise → get offers for seller
      this.fetchSellerOffers();
    }
  });
}

private fetchOffers(postId: string): void {
  this.isLoading.set(true);
  this.hasError.set(false);

  this.offerService.getAllOffersForPost(postId).subscribe({
    next: (
      res:
        | GetPostOffersResponse
        | SellerOffersResponse['data']
        | CustomerOffersResponse['data']
    ) => {
      const normalized: OfferModel[] = (res as any[]).map((offer) => ({
        _id: offer._id,
        amount: offer.amount,
        message: offer.message,
        status: offer.status as OfferStatus,
        customer:
          typeof offer.customer === 'string'
            ? ({ _id: offer.customer, fname: 'Unknown', email: '' } as UserSummary)
            : ({
                _id: offer.customer._id,
                fname: offer.customer.fname,
                email: offer.customer.email,
              } as UserSummary),
        seller:
          typeof offer.seller === 'string'
            ? ({ _id: offer.seller, fname: 'Unknown', email: '' } as UserSummary)
            : ({
                _id: offer.seller._id,
                fname: offer.seller.fname,
                email: offer.seller.email,
              } as UserSummary),
        post: typeof offer.post === 'string' ? offer.post : offer.post?._id || '',
        createdAt: offer.createdAt,
        updatedAt: offer.updatedAt,
        __v: offer.__v,
      }));

      this.offers.set(normalized);
      this.isLoading.set(false);
    },
    error: () => {
      this.isLoading.set(false);
      this.hasError.set(true);
    },
  });
}

private fetchSellerOffers(): void {
  this.isLoading.set(true);
  this.hasError.set(false);

  this.offerService.getAllOffersForSeller().subscribe({
    next: (res) => {
      const normalized: OfferModel[] = res.data.map((offer) => ({
        _id: offer._id,
        amount: offer.amount,
        message: offer.message,
        status: offer.status,
        customer: {
          _id: offer.customer._id,
          fname: offer.customer.fname,
          email: offer.customer.email,
        },
        seller: { _id: offer.seller, fname: 'You', email: '' },
        post: offer.post,
        createdAt: offer.createdAt,
        updatedAt: offer.updatedAt,
        __v: offer.__v,
      }));

      this.offers.set(normalized);
      this.isLoading.set(false);
    },
    error: () => {
      this.isLoading.set(false);
      this.hasError.set(true);
    },
  });
}


  acceptOffer(id: string): void {
    this.respondToOffer(id, 'ACCEPTED');
  }

  rejectOffer(id: string): void {
    this.respondToOffer(id, 'REJECTED');
  }

  private respondToOffer(id: string, action: 'ACCEPTED' | 'REJECTED'): void {
    this.offerService.respondToOffer(id, { action }).subscribe({
      next: (res: RespondToOfferResponse) => {
        this.offers.update((list) =>
          list.map((offer) =>
            offer._id === id
              ? { ...offer, status: res.data.status as OfferStatus }
              : offer
          )
        );
      },
      error: () => {
        alert(`Failed to ${action.toLowerCase()} offer. Please try again.`);
      },
    });
  }
}
