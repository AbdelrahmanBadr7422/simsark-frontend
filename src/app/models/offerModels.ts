import { ApiStatus } from './authModels';

export type OfferStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface UserSummary {
  _id: string;
  fname: string;
  email: string;
}
export interface Offer {
  _id: string;
  amount: number;
  message: string;
  status: OfferStatus;
  customer: UserSummary;
  seller: UserSummary;
  post: string;
  createdAt?: string;
  updatedAt?: string;
  __v: number;

}

export interface CreateOfferRequest {
  postId: string;
  amount: number;
  message: string;
}

export interface CreateOfferResponse {
  status: ApiStatus;
  data: Offer;
}

export interface RespondToOfferRequest {
  action: 'ACCEPTED' | 'REJECTED';
}

export interface RespondToOfferResponse {
  status: ApiStatus;
  data: Offer;
}

export type GetPostOffersResponse = Offer[];
