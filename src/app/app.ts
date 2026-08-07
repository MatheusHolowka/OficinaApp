import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  readonly isPublicPage = signal(true);

  constructor() {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const url = event.urlAfterRedirects || event.url || '';
      const cleanUrl = url.split('?')[0];
      this.isPublicPage.set(
        cleanUrl === '/' ||
        cleanUrl === '/login' ||
        cleanUrl === '/register' ||
        cleanUrl === '/subscription' ||
        cleanUrl === '/subscription/callback' ||
        cleanUrl === ''
      );
    });
  }
}
