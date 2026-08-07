import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 relative overflow-hidden">
      <!-- Glow Decorators -->
      <div class="absolute -top-40 -left-40 w-96 h-96 bg-purple-600 rounded-full blur-[128px] opacity-20"></div>
      <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600 rounded-full blur-[128px] opacity-20"></div>

      <div class="w-full max-w-md p-8 mx-4 bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-2xl relative z-10">
        <!-- Logo/Header -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 shadow-lg shadow-purple-500/20 mb-3">
            <span class="text-2xl font-bold tracking-wider text-white">G</span>
          </div>
          <h2 class="text-2xl font-bold text-white tracking-tight">Entrar no Gandalf</h2>
          <p class="text-slate-400 text-sm mt-2">Gestão inteligente para sua oficina mecânica</p>
        </div>

        @if (errorMessage()) {
          <div class="mb-5 p-3 rounded-lg bg-red-950/50 border border-red-500/30 text-red-300 text-sm text-center">
            {{ errorMessage() }}
          </div>
        }

        <form (ngSubmit)="onSubmit()" #loginForm="ngForm" class="space-y-5">
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">E-mail</label>
            <input
              type="email"
              name="email"
              [(ngModel)]="email"
              required
              class="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
              placeholder="seuemail@oficina.com"
            />
          </div>

          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400">Senha</label>
            </div>
            <input
              type="password"
              name="password"
              [(ngModel)]="password"
              required
              class="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            [disabled]="loading() || !loginForm.valid"
            class="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-blue-500 focus:outline-none shadow-lg shadow-purple-500/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all duration-200"
          >
            @if (loading()) {
              <span>Entrando...</span>
            } @else {
              <span>Acessar Painel</span>
            }
          </button>
        </form>

        <div class="mt-6 text-center border-t border-slate-800/80 pt-5">
          <p class="text-sm text-slate-400">
            Não tem uma conta?
            <a routerLink="/register" class="text-purple-400 hover:text-purple-300 font-medium transition">Cadastre sua oficina</a>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  password = '';

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  onSubmit(): void {
    if (!this.email || !this.password) return;

    this.loading.set(true);
    this.errorMessage.set(null);

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(
          err?.error?.message || 'Falha ao autenticar. Verifique suas credenciais.'
        );
      },
    });
  }
}
