// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {

//   constructor() { }
// }
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authKey = 'engagement_hub_token';
  private _isLoggedIn$ = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private router: Router) {}

  private hasToken(): boolean {
    return !!localStorage.getItem(this.authKey);
  }

  isLoggedIn(): boolean {
    return this._isLoggedIn$.value;
  }

  isLoggedIn$(): Observable<boolean> {
    return this._isLoggedIn$.asObservable();
  }

  // Mock login - replace with real API call to your Flask backend
  login(username: string, password: string): Observable<{ token: string }> {
    // For prototype: accept anything, return dummy token
    const fakeResponse = { token: 'FAKE_JWT_TOKEN' };
    return of(fakeResponse).pipe(
      tap(res => {
        localStorage.setItem(this.authKey, res.token);
        this._isLoggedIn$.next(true);
      })
    );
  }

  logout() {
    localStorage.removeItem(this.authKey);
    this._isLoggedIn$.next(false);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.authKey);
  }
}
