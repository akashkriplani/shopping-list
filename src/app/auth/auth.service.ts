import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user.model';
import { environment } from './../../environments/environment';
import * as fromApp from './../store/app.reducer';
import * as AuthActions from './store/auth.actions';

export interface AuthResponseData {
  kind: string;
  email: string;
  idToken: string;
  expiresIn: string;
  localId: string;
  refreshToken: string;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  // user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  autoLogin(): void {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      // this.user.next(loadedUser);
      this.store.dispatch(
        new AuthActions.AuthenticateSuccess({
          email: loadedUser.email,
          userId: loadedUser.id,
          token: loadedUser.token,
          expirationDate: new Date(userData._tokenExpirationDate)
        })
      );
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout(): void {
    // this.user.next(null);
    this.store.dispatch(new AuthActions.Logout());
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number): void {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ): void {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    // this.user.next(user);
    this.store.dispatch(
      new AuthActions.AuthenticateSuccess({
        email: email,
        userId: userId,
        token: token,
        expirationDate: expirationDate
      })
    );
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unexpected error occurred!';
    if (!errorRes?.error?.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'The email exists already.';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'The email does not exist.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'The password is incorrect.';
        break;
    }
    return throwError(errorMessage);
  }
}
