import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { catchError, Observable } from 'rxjs';
import { ErrorHandler } from './error-handler';
import { environment } from '../../environments/environment';
import {
  CreatePostRequest,
  CreatePostResponse,
  DeletePostResponse,
  GetPostByIdResponse,
  GetPostsResponse,
  updatePostRequest,
  UpdatePostResponse,
} from '../models/postModels';

@Injectable({
  providedIn: 'root',
})
export class Post {
  private _httpClient = inject(HttpClient);
  private _errorHandler = inject(ErrorHandler);
  private postUrl = `${environment.apiBaseUrl}/posts`;

  getAllPosts(): Observable<GetPostsResponse> {
    return this._httpClient
      .get<GetPostsResponse>(this.postUrl)
      .pipe(catchError(this._errorHandler.handleError));
  }
  createPost(post: CreatePostRequest): Observable<CreatePostResponse> {
    return this._httpClient
      .post<CreatePostResponse>(this.postUrl, post)
      .pipe(catchError(this._errorHandler.handleError));
  }
  getSinglePost(postId: string): Observable<GetPostByIdResponse> {
    return this._httpClient
      .get<GetPostByIdResponse>(`${this.postUrl}/${postId}`)
      .pipe(catchError(this._errorHandler.handleError));
  }
  updatePost(postId: string, post: updatePostRequest): Observable<UpdatePostResponse> {
    return this._httpClient
      .put<UpdatePostResponse>(`${this.postUrl}/${postId}`, post)
      .pipe(catchError(this._errorHandler.handleError));
  }
  deletePost(postId: string): Observable<DeletePostResponse> {
    return this._httpClient
      .delete<DeletePostResponse>(`${this.postUrl}/${postId}`)
      .pipe(catchError(this._errorHandler.handleError));
  }
}
