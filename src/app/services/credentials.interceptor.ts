import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export const credentialsInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);

  return next(request.clone({ withCredentials: true })).pipe(
    catchError((error: unknown) => {
      if (
        error instanceof HttpErrorResponse
        && error.status === 401
        && !request.url.endsWith('/auth/login')
      ) {
        authService.handleUnauthorized();
      }
      return throwError(() => error);
    }),
  );
};