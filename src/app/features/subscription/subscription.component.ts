import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 relative overflow-hidden py-12">
      <!-- Glow Decorators -->
      <div class="absolute -top-40 -left-40 w-96 h-96 bg-purple-600 rounded-full blur-[128px] opacity-20"></div>
      <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600 rounded-full blur-[128px] opacity-20"></div>

      <!-- Main Card -->
      <div class="w-full max-w-md p-8 mx-4 bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-2xl relative z-10 text-center">
        <!-- Logo -->
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 shadow-lg shadow-purple-500/20 mb-4">
          <span class="text-xl font-bold tracking-wider text-white">G</span>
        </div>

        <h2 class="text-2xl font-bold text-white tracking-tight">Ative sua Assinatura</h2>
        <p class="text-slate-400 text-xs mt-2 leading-relaxed">
          Sua conta foi criada! Para começar a gerenciar sua oficina mecânica e emitir checklists, ative sua assinatura do plano contratado.
        </p>

        <!-- Plan Info Box -->
        <div class="my-6 p-5 bg-slate-950/80 border border-slate-850 rounded-2xl text-left space-y-3 relative overflow-hidden">
          <div class="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl"></div>
          <div>
            <span class="text-[9px] text-purple-400 uppercase tracking-widest font-extrabold block">Plano Selecionado</span>
            <span class="text-lg font-extrabold text-white">Plano {{ tenantPlan() }}</span>
          </div>

          <div class="flex items-baseline gap-1 pt-1">
            <span class="text-2xl font-black text-white">R$ {{ planPrice() }}</span>
            <span class="text-slate-400 text-xs">/mês</span>
          </div>

          <div class="border-t border-slate-900 pt-3 space-y-2">
            @if (tenantPlan() === 'BRONZE') {
              <div class="flex items-center gap-2 text-xs text-slate-300">
                <span class="text-purple-400">✓</span> <span>1 Usuário (Administrador)</span>
              </div>
              <div class="flex items-center gap-2 text-xs text-slate-300">
                <span class="text-purple-400">✓</span> <span>Clientes & Veículos Ilimitados</span>
              </div>
            } @else if (tenantPlan() === 'OURO') {
              <div class="flex items-center gap-2 text-xs text-slate-300">
                <span class="text-purple-400">✓</span> <span>Usuários Ilimitados</span>
              </div>
              <div class="flex items-center gap-2 text-xs text-slate-300">
                <span class="text-purple-400">✓</span> <span>Checklist Completo com Fotos</span>
              </div>
              <div class="flex items-center gap-2 text-xs text-slate-300">
                <span class="text-purple-400">✓</span> <span>Suporte Prioritário por WhatsApp</span>
              </div>
            } @else {
              <!-- Default Prata -->
              <div class="flex items-center gap-2 text-xs text-slate-300">
                <span class="text-purple-400">✓</span> <span>Até 5 Usuários Simultâneos</span>
              </div>
              <div class="flex items-center gap-2 text-xs text-slate-300">
                <span class="text-purple-400">✓</span> <span>Checklist Completo com Fotos</span>
              </div>
              <div class="flex items-center gap-2 text-xs text-slate-300">
                <span class="text-purple-400">✓</span> <span>Gerador de OS PDF Impressa</span>
              </div>
            }
          </div>
        </div>

        @if (errorMessage()) {
          <div class="mb-4 p-3 rounded-lg bg-red-950/50 border border-red-500/30 text-red-300 text-xs">
            {{ errorMessage() }}
          </div>
        }

        <!-- Actions -->
        <div class="space-y-3">
          <button
            (click)="checkout()"
            [disabled]="loading()"
            class="w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/20 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none transition-all duration-200 text-sm flex items-center justify-center gap-2"
          >
            @if (loading()) {
              <span class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span>Redirecionando...</span>
            } @else {
              <span>Pagar com Abacate Pay</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            }
          </button>

          <button
            (click)="logout()"
            class="w-full py-2.5 px-4 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold rounded-xl transition text-xs"
          >
            Sair da Conta
          </button>
        </div>

        <div class="mt-6 text-[10px] text-slate-500 leading-relaxed max-w-[280px] mx-auto">
          Você será redirecionado para o ambiente seguro do Abacate Pay para efetuar o pagamento.
        </div>
      </div>
    </div>
  `
})
export class SubscriptionComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly http = inject(HttpClient);

  readonly tenantPlan = signal<string>('PRATA');
  readonly planPrice = signal<number>(199);
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    const tenant = this.authService.currentTenant();
    if (tenant) {
      this.updatePlanInfo(tenant);
    } else {
      this.authService.getTenantDetails().subscribe({
        next: (t) => this.updatePlanInfo(t),
        error: () => this.errorMessage.set('Erro ao carregar plano de assinatura.')
      });
    }
  }

  updatePlanInfo(tenant: any): void {
    const plan = tenant.plan || 'PRATA';
    this.tenantPlan.set(plan);
    if (plan === 'BRONZE') this.planPrice.set(99);
    else if (plan === 'OURO') this.planPrice.set(299);
    else this.planPrice.set(199);
  }

  checkout(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    const token = this.authService.getToken();
    this.http.post<any>(`${environment.apiUrl}/billing/checkout`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).subscribe({
      next: (res) => {
        if (res.init_point) {
          window.location.href = res.init_point;
        } else {
          this.loading.set(false);
          this.errorMessage.set('Resposta inválida do gateway de faturamento.');
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err?.error?.message || 'Falha ao iniciar checkout.');
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
