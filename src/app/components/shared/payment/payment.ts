import { Component, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment.html',
})
export class Payment implements OnInit {

  @Input() moneyAmount!:number;
  private stripeKey = environment.stripe.publicKey;
  paymentHandler: any = null;
  loading = false;


  ngOnInit() {
    this.loadStripeScript();
  }

  makePayment(amount: number): void {
    this.loading = true;

    if (!this.paymentHandler) {
      console.error('Stripe not loaded');
      this.loading = false;
      return;
    }
    this.paymentHandler.open({
      name: 'My Company',
      description: `Payment of $${amount}`,
      amount: amount * 100,
    });
  }

  loadStripeScript(): void {
    if (window.document.getElementById('stripe-script')) return;

    const script = window.document.createElement('script');
    script.id = 'stripe-script';
    script.type = 'text/javascript';
    script.src = 'https://checkout.stripe.com/checkout.js';
    script.onload = () => {
      this.paymentHandler = (window as any).StripeCheckout.configure({
        key: this.stripeKey,
        locale: 'auto',
        token: (token: any) => {
          console.log('Stripe token:', token);
          alert('✅ Payment successful!');
          this.loading = false;
        },
        closed: () => {
          this.loading = false;
        },
      });
    };
    window.document.body.appendChild(script);
  }
}
