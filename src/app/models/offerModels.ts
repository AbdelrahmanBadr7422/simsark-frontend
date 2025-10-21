import { ApiStatus } from './authModels';

export type OfferStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface UserSummary {
  _id: string;
  fname: string;
  email: string;
}
export type PostSummaryOrId =
  | string
  | {
      _id: string;
      title: string;
      description: string;
      price: number;
      propertyType: string;
      area: number;
      rooms: number;
      bathrooms: number;
      images: string[];
      owner: string;
      createdAt: string;
      updatedAt: string;
      __v: number;
    };

export interface Offer {
  _id: string;
  amount: number;
  message: string;
  status: OfferStatus;
  customer: UserSummary;
  seller: UserSummary;
  post: PostSummaryOrId;
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

export interface CustomerOffersResponse {
  status: ApiStatus;
  data: {
    _id: string;
    amount: number;
    message: string;
    status: OfferStatus;
    customer: string; 
    seller: {
      _id: string;
      email: string;
      password: string;
      fname: string;
      lname: string;
      role: string;
      __v: number;
    };
    post: {
      _id: string;
      title: string;
      description: string;
      price: number;
      propertyType: string;
      area: number;
      rooms: number;
      bathrooms: number;
      images: string[];
      owner: string;
      createdAt: string;
      updatedAt: string;
      __v: number;
    };
    createdAt: string;
    updatedAt: string;
    __v: number;
  }[];
}

export interface SellerOffersResponse {
  status: ApiStatus;
  data: {
    _id: string;
    amount: number;
    message: string;
    status: OfferStatus;
    customer: {
      _id: string;
      email: string;
      password: string;
      fname: string;
      lname: string;
      role: string;
      __v: number;
    };
    seller: string;
    post: {
      _id: string;
      title: string;
      description: string;
      price: number;
      propertyType: string;
      area: number;
      rooms: number;
      bathrooms: number;
      images: string[];
      owner: string;
      createdAt: string;
      updatedAt: string;
      __v: number;
    };
    createdAt: string;
    updatedAt: string;
    __v: number;
  }[];
}
