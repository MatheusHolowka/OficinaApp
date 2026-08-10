import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="space-y-8">
      <!-- Welcome Header -->
      <div>
        <h2 class="text-3xl font-bold text-white tracking-tight">Olá, bem-vindo de volta!</h2>
        <p class="text-slate-400 mt-1">Aqui está o resumo geral das atividades de hoje na sua oficina.</p>
      </div>

      <!-- Quick Action Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <a routerLink="/customers" class="p-5 bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-xl hover:border-purple-500/50 transitiongroup group relative overflow-hidden flex flex-col justify-between h-32">
          <div class="absolute right-0 bottom-0 w-24 h-24 bg-gradient-to-br from-purple-600 to-transparent blur-[48px] opacity-10 group-hover:opacity-20 transition-all"></div>
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-400 group-hover:text-purple-400 transition-colors">Clientes</span>
          <div class="flex justify-between items-end mt-2">
            <span class="text-3xl font-bold text-white">{{ stats().customers }}</span>
            <span class="text-xs text-slate-400 group-hover:text-slate-200 transition-colors flex items-center gap-1">
              Ver todos &rarr;
            </span>
          </div>
        </a>

        <a routerLink="/vehicles" class="p-5 bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-xl hover:border-purple-500/50 transitiongroup group relative overflow-hidden flex flex-col justify-between h-32">
          <div class="absolute right-0 bottom-0 w-24 h-24 bg-gradient-to-br from-blue-600 to-transparent blur-[48px] opacity-10 group-hover:opacity-20 transition-all"></div>
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-400 group-hover:text-blue-400 transition-colors">Veículos</span>
          <div class="flex justify-between items-end mt-2">
            <span class="text-3xl font-bold text-white">{{ stats().vehicles }}</span>
            <span class="text-xs text-slate-400 group-hover:text-slate-200 transition-colors flex items-center gap-1">
              Ver todos &rarr;
            </span>
          </div>
        </a>

        <a routerLink="/checklists" class="p-5 bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-xl hover:border-purple-500/50 transitiongroup group relative overflow-hidden flex flex-col justify-between h-32">
          <div class="absolute right-0 bottom-0 w-24 h-24 bg-gradient-to-br from-indigo-600 to-transparent blur-[48px] opacity-10 group-hover:opacity-20 transition-all"></div>
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-400 group-hover:text-indigo-400 transition-colors">Checklists / Vistorias</span>
          <div class="flex justify-between items-end mt-2">
            <span class="text-3xl font-bold text-white">{{ stats().checklists }}</span>
            <span class="text-xs text-slate-400 group-hover:text-slate-200 transition-colors flex items-center gap-1">
              Ver todos &rarr;
            </span>
          </div>
        </a>

        <a routerLink="/work-orders" class="p-5 bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-xl hover:border-purple-500/50 transitiongroup group relative overflow-hidden flex flex-col justify-between h-32">
          <div class="absolute right-0 bottom-0 w-24 h-24 bg-gradient-to-br from-emerald-600 to-transparent blur-[48px] opacity-10 group-hover:opacity-20 transition-all"></div>
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-400 group-hover:text-emerald-400 transition-colors">Ordens de Serviço</span>
          <div class="flex justify-between items-end mt-2">
            <span class="text-3xl font-bold text-white">{{ stats().workOrders }}</span>
            <span class="text-xs text-slate-400 group-hover:text-slate-200 transition-colors flex items-center gap-1">
              Ver todos &rarr;
            </span>
          </div>
        </a>
      </div>

      <!-- Main Columns -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Ordens de Serviço Recentes -->
        <div class="lg:col-span-2 bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 space-y-6">
          <div class="flex justify-between items-center">
            <div>
              <h3 class="text-lg font-bold text-white">Ordens de Serviço Ativas</h3>
              <p class="text-xs text-slate-400 mt-0.5">Últimas ordens de serviço abertas no sistema</p>
            </div>
            <a routerLink="/work-orders" class="text-xs font-semibold text-purple-400 hover:text-purple-300 transition">Ver Todas</a>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  <th class="pb-3">Cliente / Veículo</th>
                  <th class="pb-3 text-center">Status</th>
                  <th class="pb-3 text-right">Valor Total</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800 text-sm">
                @for (wo of activeWorkOrders(); track wo.id) {
                  <tr>
                    <td class="py-3.5">
                      <div class="font-semibold text-white">{{ wo.customer?.name }}</div>
                      <div class="text-xs text-slate-400">{{ wo.vehicle?.brand }} {{ wo.vehicle?.model }} ({{ wo.vehicle?.plate }})</div>
                    </td>
                    <td class="py-3.5 text-center">
                      <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border" [class]="getStatusClass(wo.status)">
                        {{ getStatusLabel(wo.status) }}
                      </span>
                    </td>
                    <td class="py-3.5 text-right font-bold text-slate-200">
                      R$ {{ Number(wo.totalAmount).toFixed(2) }}
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="3" class="py-8 text-center text-slate-500">
                      Nenhuma ordem de serviço ativa no momento.
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- Barra Lateral de Atalhos Rápidos -->
        <div class="space-y-6">
          <!-- Ações Rápidas -->
          <div class="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 space-y-4">
            <h3 class="text-lg font-bold text-white">Fluxo de Entrada</h3>
            <p class="text-xs text-slate-400">Fluxo recomendado para entrada de novos veículos</p>
            
            <div class="space-y-2">
              <a routerLink="/checklists" class="w-full flex items-center justify-between p-3 bg-slate-950/50 hover:bg-slate-950/80 border border-slate-800/80 rounded-xl transition group">
                <div class="flex items-center gap-3">
                  <span class="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">1</span>
                  <div class="text-left">
                    <div class="text-xs font-semibold text-slate-200 group-hover:text-indigo-400 transition">Checklist / Vistoria</div>
                    <div class="text-[10px] text-slate-500">Realizar vistoria de entrada</div>
                  </div>
                </div>
                <span class="text-slate-600 group-hover:text-indigo-400 transition">&rarr;</span>
              </a>

              <a routerLink="/work-orders" class="w-full flex items-center justify-between p-3 bg-slate-950/50 hover:bg-slate-950/80 border border-slate-800/80 rounded-xl transition group">
                <div class="flex items-center gap-3">
                  <span class="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">2</span>
                  <div class="text-left">
                    <div class="text-xs font-semibold text-slate-200 group-hover:text-emerald-400 transition">Ordem de Serviço</div>
                    <div class="text-[10px] text-slate-500">Abrir OS para reparos</div>
                  </div>
                </div>
                <span class="text-slate-600 group-hover:text-emerald-400 transition">&rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  readonly stats = signal({
    customers: 0,
    vehicles: 0,
    checklists: 0,
    workOrders: 0,
  });

  readonly activeWorkOrders = signal<any[]>([]);
  protected readonly Number = Number;

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    forkJoin({
      customers: this.http.get<any[]>(`${this.apiUrl}/customers`),
      vehicles: this.http.get<any[]>(`${this.apiUrl}/vehicles`),
      checklists: this.http.get<any[]>(`${this.apiUrl}/checklists`),
      workOrders: this.http.get<any[]>(`${this.apiUrl}/work-orders`),
    }).subscribe({
      next: (res) => {
        this.stats.set({
          customers: res.customers.length,
          vehicles: res.vehicles.length,
          checklists: res.checklists.length,
          workOrders: res.workOrders.length,
        });

        // Limita a 5 OSs ativas ordenadas por data
        this.activeWorkOrders.set(res.workOrders.slice(0, 5));
      },
      error: (err) => {
        console.error('Erro ao carregar métricas do dashboard', err);
      },
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'QUEUED': return 'bg-slate-800 text-slate-300 border-slate-700';
      case 'ESTIMATING': return 'bg-yellow-950/40 text-yellow-300 border-yellow-700/30';
      case 'APPROVED': return 'bg-blue-950/40 text-blue-300 border-blue-700/30';
      case 'EXECUTING': return 'bg-purple-950/40 text-purple-300 border-purple-700/30';
      case 'AWAITING_PARTS': return 'bg-orange-950/40 text-orange-300 border-orange-700/30';
      case 'COMPLETED': return 'bg-emerald-950/40 text-emerald-300 border-emerald-700/30';
      case 'DELIVERED': return 'bg-teal-950/40 text-teal-300 border-teal-700/30';
      case 'CANCELLED': return 'bg-red-950/40 text-red-300 border-red-700/30';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'QUEUED': return 'Na fila';
      case 'ESTIMATING': return 'Orçamento';
      case 'APPROVED': return 'Aprovado';
      case 'EXECUTING': return 'Em Execução';
      case 'AWAITING_PARTS': return 'Aguard. Peça';
      case 'COMPLETED': return 'Finalizado';
      case 'DELIVERED': return 'Entregue';
      case 'CANCELLED': return 'Cancelado';
      default: return status;
    }
  }
}
