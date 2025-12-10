// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {

//   constructor() { }
// }
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authKey = 'engagement_hub_token';
  private _isLoggedIn$ = new BehaviorSubject<boolean>(this.hasToken());
  private apiUrl = environment.apiUrl;  // ← added

  constructor(
    private router: Router,
    private http: HttpClient       // ← added
  ) {}

  private hasToken(): boolean {
    return !!localStorage.getItem(this.authKey);
  }

  isLoggedIn(): boolean {
    return this._isLoggedIn$.value;
  }

  isLoggedIn$(): Observable<boolean> {
    return this._isLoggedIn$.asObservable();
  }

  // 🔵 SIMPLE MOCK LOGIN FOR NOW
  login(username: string, password: string): Observable<{ token: string }> {
    // Later: return this.http.post(`${this.apiUrl}/login`, { username, password });

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