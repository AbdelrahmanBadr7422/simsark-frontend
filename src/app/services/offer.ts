import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { ErrorHandler } from './error-handler';
import { catchError, Observable } from 'rxjs';
import {
  CreateOfferRequest,
  CreateOfferResponse,
  RespondToOfferRequest,
  GetPostOffersResponse,
} from '../models/offerModels';

@Injectable({
  providedIn: 'root',
})
export class Offer {
  private _httpClient = inject(HttpClient);
  private _errorHandler = inject(ErrorHandler);
  private offerUrl = `${environment.apiBaseUrl}/offers`;

  addOfferService(offer: CreateOfferRequest): Observable<CreateOfferResponse> {
    return this._httpClient
      .post<CreateOfferResponse>(this.offerUrl, offer)
      .pipe(catchError(this._errorHandler.handleError));
  }

  grespondeToOffer(respond: RespondToOfferRequest): Observable<RespondToOfferRequest> {
    return this._httpClient
      .patch<RespondToOfferRequest>(this.offerUrl, respond)
      .pipe(catchError(this._errorHandler.handleError));
  }

  getAllOffersForPost(postId: string): Observable<GetPostOffersResponse> {
    return this._httpClient
      .get<GetPostOffersResponse>(`${this.offerUrl}/post/${postId}`)
      .pipe(catchError(this._errorHandler.handleError));
  }
}
