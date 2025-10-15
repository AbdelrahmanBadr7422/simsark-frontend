import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

export interface ApiError {
  status: number;
  message: string;
  details?: unknown;
}

@Injectable({ providedIn: 'root' })
export class ErrorHandler {
  handleError = (error: HttpErrorResponse): Observable<never> => {
    let apiError: ApiError = { status: error.status, message: 'Unexpected error occurred.' };

    if (error.error instanceof ErrorEvent) {
      apiError.message = error.error.message || 'Network error. Please check your connection.';
    } else {
      const backendMsg =
        (typeof error.error === 'string' && error.error) ||
        (error.error?.message as string) ||
        error.message;

      switch (error.status) {
        case 0:
          apiError.message = 'Cannot reach server. Please try again later.';
          break;
        case 400:
          apiError.message = backendMsg || 'Bad request.';
          apiError.details = error.error;
          break;
        case 401:
          apiError.message = 'Unauthorized. Please login again.';
          break;
        case 403:
          apiError.message = 'Forbidden. You don’t have permission to perform this action.';
          break;
        case 404:
          apiError.message = 'Resource not found.';
          break;
        case 409:
          apiError.message = backendMsg || 'Conflict (duplicated or invalid state).';
          break;
        case 422:
          apiError.message = backendMsg || 'Validation failed.';
          apiError.details = error.error;
          break;
        case 500:
          apiError.message = 'Server error. Please try again later.';
          break;
        default:
          apiError.message = backendMsg || `Unexpected error (code ${error.status}).`;
      }
    }

    console.error('[API ERROR]', apiError, error);
    return throwError(() => apiError);
  };
}
