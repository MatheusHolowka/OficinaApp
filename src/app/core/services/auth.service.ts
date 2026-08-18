import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiUrl = environment.apiUrl;

  private readonly tokenKey = 'oficinaflow_auth_token';

  // Signals
  readonly currentUser = signal<any | null>(null);
  readonly currentTenant = signal<any | null>(null);
  readonly isAuthenticated = computed(() => !!this.currentUser());

  constructor() {
    this.checkToken();
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap((res) => {
        if (res.access_token) {
          localStorage.setItem(this.tokenKey, res.access_token);
          this.checkToken();
        }
      })
    );
  }

  register(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/register`, data).pipe(
      tap((res) => {
        if (res.access_token) {
          localStorage.setItem(this.tokenKey, res.access_token);
          this.checkToken();
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUser.set(null);
    this.currentTenant.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  getTenantDetails(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/tenant`);
  }

  loadTenantDetails(): void {
    this.getTenantDetails().subscribe({
      next: (tenant) => this.currentTenant.set(tenant),
      error: (err) => console.error('Erro ao carregar dados do tenant', err),
    });
  }

  private checkToken(): void {
    const token = this.getToken();
    if (token) {
      const decoded = this.decodeToken(token);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        this.currentUser.set({
          id: decoded.sub,
          email: decoded.email,
          name: decoded.name,
          role: decoded.role,
          tenantId: decoded.tenantId,
        });
        this.loadTenantDetails();
        return;
      }
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.tokenKey);
    }
    this.currentUser.set(null);
    this.currentTenant.set(null);
  }

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }
}
