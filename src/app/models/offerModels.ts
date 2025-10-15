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
/**
 * {
    "_id": "68ef0148be1887094c0f1174",
    "amount": 1,
    "message": "test",
    "status": "PENDING",
    "customer": {
      "_id": "68d7a368cd0e005ec9743f26",
      "email": "osamaelsaeed@gmail.com",
      "fname": "osama"
    },
    "seller": {
      "_id": "68d7c10c27cceeba458b9ec4",
      "email": "user@example.com",
      "fname": "John"
    },
    "post": "68d7c367943f7487dc8dbd80",
    "createdAt": "2025-10-15T02:04:56.973Z",
    "updatedAt": "2025-10-15T02:04:56.973Z",
    "__v": 0
  }
 */
