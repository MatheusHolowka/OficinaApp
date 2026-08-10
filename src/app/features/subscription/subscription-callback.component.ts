import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-subscription-callback',
  standalone: true,
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 relative overflow-hidden py-12">
      <!-- Glow Decorators -->
      <div class="absolute -top-40 -left-40 w-96 h-96 bg-purple-600 rounded-full blur-[128px] opacity-20"></div>
      <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600 rounded-full blur-[128px] opacity-20"></div>

      <!-- Main Card -->
      <div class="w-full max-w-md p-8 mx-4 bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-2xl relative z-10 text-center">
        @if (status() === 'loading') {
          <div class="space-y-6 py-6">
            <div class="relative w-16 h-16 mx-auto">
              <div class="absolute inset-0 rounded-full border-4 border-slate-850"></div>
              <div class="absolute inset-0 rounded-full border-4 border-t-purple-500 animate-spin"></div>
            </div>
            <h2 class="text-xl font-bold text-white tracking-tight">Verificando Pagamento</h2>
            <p class="text-slate-400 text-xs max-w-xs mx-auto leading-relaxed">
              Estamos consultando a compensação do seu Pix/Cartão junto ao gateway Abacate Pay...
            </p>
          </div>
        }

        @if (status() === 'success') {
          <div class="space-y-6 py-4">
            <div class="w-16 h-16 bg-green-950/80 border border-green-500/40 rounded-full flex items-center justify-center mx-auto text-green-400 text-2xl shadow-lg shadow-green-500/20 animate-bounce">
              ✓
            </div>
            <h2 class="text-xl font-bold text-white tracking-tight">Assinatura Ativada!</h2>
            <p class="text-slate-400 text-xs max-w-xs mx-auto leading-relaxed">
              Parabéns! O pagamento foi confirmado. Sua oficina está pronta para ser gerenciada.
            </p>
            <p class="text-purple-400 text-xs font-semibold animate-pulse">
              Redirecionando para o painel principal...
            </p>
          </div>
        }

        @if (status() === 'error') {
          <div class="space-y-6 py-4">
            <div class="w-16 h-16 bg-red-950/80 border border-red-500/40 rounded-full flex items-center justify-center mx-auto text-red-400 text-2xl shadow-lg shadow-red-500/20">
              ✕
            </div>
            <h2 class="text-xl font-bold text-white tracking-tight">Pagamento não Confirmado</h2>
            <p class="text-red-300 text-xs bg-red-950/30 border border-red-900/30 p-3 rounded-xl max-w-xs mx-auto leading-relaxed">
              {{ errorMessage() || 'Ainda não identificamos a confirmação do pagamento.' }}
            </p>
            <div class="flex flex-col gap-2 pt-2">
              <button
                (click)="verify()"
                class="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-xl transition text-sm"
              >
                Tentar Novamente
              </button>
              <button
                (click)="goToCheckout()"
                class="w-full py-2.5 px-4 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold rounded-xl transition text-xs"
              >
                Voltar para o Checkout
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class SubscriptionCallbackComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  readonly status = signal<'loading' | 'success' | 'error'>('loading');
  readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.verify();
  }

  verify(): void {
    this.status.set('loading');
    this.errorMessage.set(null);

    const token = this.authService.getToken();

    this.http.post<any>(`${environment.apiUrl}/billing/verify`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).subscribe({
      next: (res) => {
        if (res.success) {
          this.status.set('success');
          this.authService.loadTenantDetails();
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 2500);
        } else {
          this.status.set('error');
          this.errorMessage.set(res.message || 'Assinatura não ativada.');
        }
      },
      error: (err) => {
        this.status.set('error');
        this.errorMessage.set(err?.error?.message || 'Ainda não recebemos a aprovação da administradora.');
      }
    });
  }

  goToCheckout(): void {
    this.router.navigate(['/subscription']);
  }
}
