import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 relative overflow-hidden py-12">
      <!-- Glow Decorators -->
      <div class="absolute -top-40 -left-40 w-96 h-96 bg-purple-600 rounded-full blur-[128px] opacity-20"></div>
      <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600 rounded-full blur-[128px] opacity-20"></div>

      <!-- Main Registration Card -->
      <div class="w-full max-w-xl p-8 mx-4 bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-2xl relative z-10">
        <!-- Logo/Header -->
        <div class="text-center mb-6">
          <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 shadow-lg shadow-purple-500/20 mb-2">
            <span class="text-xl font-bold tracking-wider text-white">G</span>
          </div>
          <h2 class="text-xl font-bold text-white tracking-tight">Criar Conta da Oficina</h2>
          <p class="text-slate-400 text-xs mt-1">Conclua o seu cadastro e inicie no gerenciamento digital</p>
        </div>

        @if (errorMessage()) {
          <div class="mb-5 p-3 rounded-lg bg-red-950/50 border border-red-500/30 text-red-300 text-sm text-center">
            {{ errorMessage() }}
          </div>
        }

        <form (ngSubmit)="onSubmit()" #registerForm="ngForm" class="space-y-4">
          <!-- Dados da Oficina -->
          <div class="border-b border-slate-850 pb-4">
            <h3 class="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-3">Sobre a Oficina</h3>
            
            <div class="grid grid-cols-1 gap-3">
              <div>
                <label class="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Nome da Oficina</label>
                <input
                  type="text"
                  name="tenantName"
                  [(ngModel)]="tenantName"
                  (ngModelChange)="onTenantNameChange($event)"
                  required
                  class="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition text-sm"
                  placeholder="Oficina Mecânica Precision"
                />
              </div>

              <div>
                <label class="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Subdomínio (Slug)</label>
                <input
                  type="text"
                  name="tenantSlug"
                  [(ngModel)]="tenantSlug"
                  required
                  class="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition text-xs font-mono"
                  placeholder="oficina-precision"
                />
                <span class="text-[10px] text-slate-500 mt-1 block">Link de acesso: gandalf.com/{{ tenantSlug || 'sua-oficina' }}</span>
              </div>
            </div>
          </div>

          <!-- Dados do Administrador -->
          <div class="border-b border-slate-850 pb-4">
            <h3 class="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-3">Sobre o Administrador</h3>
            
            <div class="space-y-3">
              <div>
                <label class="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Nome Completo</label>
                <input
                  type="text"
                  name="userName"
                  [(ngModel)]="userName"
                  required
                  class="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition text-sm"
                  placeholder="Ex: João da Silva"
                />
              </div>

              <div>
                <label class="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">E-mail Corporativo</label>
                <input
                  type="email"
                  name="email"
                  [(ngModel)]="email"
                  required
                  class="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition text-sm"
                  placeholder="joao@oficina.com"
                />
              </div>

              <div>
                <label class="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Senha Secreta</label>
                <input
                  type="password"
                  name="password"
                  [(ngModel)]="password"
                  required
                  minlength="6"
                  class="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition text-sm"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
            </div>
          </div>

          <!-- Seleção do Plano -->
          <div>
            <h3 class="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-3">Escolha seu Plano</h3>
            <div class="grid grid-cols-3 gap-2.5">
              <label 
                class="flex flex-col items-center justify-center p-3 rounded-xl border cursor-pointer transition text-center select-none"
                [class.bg-purple-950/30]="plan() === 'BRONZE'"
                [class.border-purple-500]="plan() === 'BRONZE'"
                [class.border-slate-800]="plan() !== 'BRONZE'"
                [class.hover:border-slate-700]="plan() !== 'BRONZE'"
              >
                <input type="radio" name="plan" value="BRONZE" [(ngModel)]="planModel" (change)="selectPlan('BRONZE')" class="sr-only" />
                <span class="text-xs font-bold text-white">BRONZE</span>
                <span class="text-[10px] text-slate-400 mt-1">R$ 99/mês</span>
              </label>

              <label 
                class="flex flex-col items-center justify-center p-3 rounded-xl border cursor-pointer transition text-center select-none relative"
                [class.bg-purple-950/30]="plan() === 'PRATA'"
                [class.border-purple-500]="plan() === 'PRATA'"
                [class.border-slate-800]="plan() !== 'PRATA'"
                [class.hover:border-slate-700]="plan() !== 'PRATA'"
              >
                <div class="absolute -top-2 px-1.5 py-0.5 rounded bg-purple-600 text-[7px] font-extrabold text-white tracking-widest uppercase">Popular</div>
                <input type="radio" name="plan" value="PRATA" [(ngModel)]="planModel" (change)="selectPlan('PRATA')" class="sr-only" />
                <span class="text-xs font-bold text-white mt-1">PRATA</span>
                <span class="text-[10px] text-slate-400 mt-1">R$ 199/mês</span>
              </label>

              <label 
                class="flex flex-col items-center justify-center p-3 rounded-xl border cursor-pointer transition text-center select-none"
                [class.bg-purple-950/30]="plan() === 'OURO'"
                [class.border-purple-500]="plan() === 'OURO'"
                [class.border-slate-800]="plan() !== 'OURO'"
                [class.hover:border-slate-700]="plan() !== 'OURO'"
              >
                <input type="radio" name="plan" value="OURO" [(ngModel)]="planModel" (change)="selectPlan('OURO')" class="sr-only" />
                <span class="text-xs font-bold text-white">OURO</span>
                <span class="text-[10px] text-slate-400 mt-1">R$ 299/mês</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            [disabled]="!registerForm.valid || loading()"
            class="w-full py-3 px-4 mt-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-blue-500 focus:outline-none shadow-lg shadow-purple-500/20 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none transition-all duration-200 text-sm flex items-center justify-center gap-2"
          >
            @if (loading()) {
              <span class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span>Cadastrando...</span>
            } @else {
              <span>Prosseguir para Ativação</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            }
          </button>
        </form>

        <div class="mt-5 text-center border-t border-slate-800/80 pt-4">
          <p class="text-xs text-slate-400">
            Já tem uma oficina cadastrada?
            <a routerLink="/login" class="text-purple-400 hover:text-purple-300 font-semibold transition">Fazer login</a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  // Form Fields
  tenantName = '';
  tenantSlug = '';
  userName = '';
  email = '';
  password = '';
  planModel = 'PRATA';

  // Plan Details
  readonly plan = signal<string>('PRATA');

  // Loading & states
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    // Get plan from query params
    this.route.queryParams.subscribe((params) => {
      if (params['plan']) {
        const queryPlan = params['plan'].toUpperCase();
        if (['BRONZE', 'PRATA', 'OURO'].includes(queryPlan)) {
          this.plan.set(queryPlan);
          this.planModel = queryPlan;
        }
      }
    });
  }

  selectPlan(selectedPlan: string): void {
    this.plan.set(selectedPlan);
  }

  onTenantNameChange(val: string): void {
    this.tenantSlug = val
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  onSubmit(): void {
    if (this.loading()) return;
    this.loading.set(true);
    this.errorMessage.set(null);

    const payload = {
      tenantName: this.tenantName,
      tenantSlug: this.tenantSlug,
      userName: this.userName,
      email: this.email,
      password: this.password,
      plan: this.plan()
    };

    this.authService.register(payload).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.checkoutUrl) {
          window.location.href = res.checkoutUrl;
        } else {
          this.router.navigate(['/subscription']);
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(
          err?.error?.message || 'Falha ao registrar oficina. Verifique se o e-mail ou subdomínio já estão em uso.'
        );
      },
    });
  }
}
