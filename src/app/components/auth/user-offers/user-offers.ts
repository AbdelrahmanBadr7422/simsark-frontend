import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OffersList } from '../offers-list/offers-list';
import { OfferStatus, CustomerOffersResponse } from '../../../models/offerModels';
import { RouterModule } from '@angular/router';
import { Offer } from '../../../services/offer';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-user-offers',
  standalone: true,
  imports: [CommonModule, OffersList, RouterModule],
  templateUrl: './user-offers.html',
})
export class UserOffers implements OnInit, OnDestroy {
  private offerService = inject(Offer);
  private destroy$ = new Subject<void>();

  isSeller = localStorage.getItem('userRole') === 'seller';
  isLoading = signal(false);
  hasError = signal(false);
  offers = signal<CustomerOffersResponse['data']>([]);

  ngOnInit(): void {
    if (!this.isSeller) {
      this.fetchCustomerOffers();
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  private fetchCustomerOffers(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.offerService
      .getAllOffersForCustomer()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: CustomerOffersResponse) => {
          this.offers.set(res.data);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
          this.hasError.set(true);
        },
      });
  }
}
