import { UserSummary } from './offerModels';

export type PropertyType = 'apartment' | 'villa' | 'studio' | 'land' | string;

export interface Post {
  _id: string;
  title: string;
  description: string;
  price: number;
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
  images: string[];
}

export interface CreatePostResponse {
  success: boolean;
  data: Post;
}

export interface GetPostsResponse {
  success: boolean;
  data: Post[];
}

export interface GetPostByIdResponse {
  success: boolean;
  data: Post;
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
  data: Post;
}

export interface DeletePostResponse {
  success: boolean;
  message: string;
}
