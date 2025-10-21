import { UserSummary } from './offerModels';

export type PropertyType = 'Apartment' | 'Villa' | 'Office';

export interface PostModel {
  _id: string;
  title: string;
  description: string;
  price: number;
  address?: string;
  propertyType: PropertyType;
  area: number;
  rooms: number;
  bathrooms: number;
  images: string[];
  owner: UserSummary;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePostRequest {
  title: string;
  description: string;
  price: number;
  propertyType: PropertyType;
  area: number;
  rooms: number;
  bathrooms: number;
  images?: string[];
}

export interface CreatePostResponse {
  success: boolean;
  data: PostModel;
}

export interface GetPostsResponse {
  success: boolean;
  data: PostModel[];
}

export interface GetPostByIdResponse {
  success: boolean;
  data: PostModel;
}
export interface updatePostRequest {
  title?: string;
  description?: string;
  price?: number;
  propertyType?: PropertyType;
  area?: number;
  rooms?: number;
  bathrooms?: number;
  images?: string[];
}
export interface UpdatePostResponse {
  success: boolean;
  data: PostModel;
}

export interface DeletePostResponse {
  success: boolean;
  message: string;
}
