import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-checklists',
  standalone: true,
  imports: [FormsModule, DatePipe],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 class="text-2xl font-bold text-white tracking-tight">Checklists (Vistorias)</h2>
          <p class="text-slate-400 text-sm mt-0.5">Histórico e realização de vistorias digitais de entrada de veículos.</p>
        </div>
        <button
          (click)="openModal()"
          class="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-lg shadow-lg shadow-purple-500/10 active:scale-[0.98] transition-all text-sm"
        >
          + Nova Vistoria
        </button>
      </div>

      <!-- List Card -->
      <div class="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 space-y-4">
        <!-- Search bar -->
        <div class="flex max-w-md">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (ngModelChange)="filterChecklists()"
            placeholder="Pesquisar por placa ou inspetor..."
            class="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition text-sm"
          />
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                <th class="pb-3">Data</th>
                <th class="pb-3">Veículo</th>
                <th class="pb-3">Km</th>
                <th class="pb-3">Combustível</th>
                <th class="pb-3">Inspetor</th>
                <th class="pb-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800 text-sm">
              @for (check of filteredChecklists(); track check.id) {
                <tr class="hover:bg-slate-800/20 transition-colors">
                  <td class="py-3.5 text-slate-300">{{ check.createdAt | date: 'dd/MM/yyyy HH:mm' }}</td>
                  <td class="py-3.5">
                    <div class="font-semibold text-white">{{ check.vehicle?.brand }} {{ check.vehicle?.model }}</div>
                    <div class="text-xs text-slate-400">Placa: {{ check.vehicle?.plate }}</div>
                  </td>
                  <td class="py-3.5 text-slate-300">{{ check.mileage }} Km</td>
                  <td class="py-3.5 text-slate-300">{{ getFuelLabel(check.fuelLevel) }}</td>
                  <td class="py-3.5 text-slate-400">{{ check.inspector?.name }}</td>
                  <td class="py-3.5 text-right space-x-2">
                    <button
                      (click)="viewDetails(check)"
                      class="px-2.5 py-1 text-xs font-semibold rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                    >
                      Ver Detalhes
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="6" class="py-8 text-center text-slate-500">
                    Nenhum checklist realizado ainda.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal Form -->
      @if (showModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div class="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <!-- Modal Header -->
            <div class="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
              <h3 class="text-base font-bold text-white">Nova Vistoria de Entrada</h3>
              <button (click)="closeModal()" class="text-slate-400 hover:text-white text-lg font-bold">&times;</button>
            </div>

            <!-- Modal Body -->
            <form (ngSubmit)="saveChecklist()" #checkForm="ngForm" class="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              @if (errorMessage()) {
                <div class="p-3 rounded bg-red-950/50 border border-red-500/20 text-red-300 text-xs text-center">
                  {{ errorMessage() }}
                </div>
              }

              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Veículo</label>
                <select
                  name="vehicleId"
                  [(ngModel)]="formData.vehicleId"
                  required
                  class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition text-sm"
                >
                  <option value="" disabled selected>Selecione um veículo...</option>
                  @for (v of vehicles(); track v.id) {
                    <option [value]="v.id">{{ v.brand }} {{ v.model }} - {{ v.plate }}</option>
                  }
                </select>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Quilometragem (Km)</label>
                  <input
                    type="number"
                    name="mileage"
                    [(ngModel)]="formData.mileage"
                    required
                    placeholder="Ex: 85000"
                    class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition text-sm"
                  />
                </div>

                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Nível de Combustível</label>
                  <select
                    name="fuelLevel"
                    [(ngModel)]="formData.fuelLevel"
                    required
                    class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition text-sm"
                  >
                    <option value="E">Reserva (Vazio)</option>
                    <option value="1/4">1/4 Tanque</option>
                    <option value="1/2">Meio Tanque (1/2)</option>
                    <option value="3/4">3/4 Tanque</option>
                    <option value="F">Tanque Cheio (F)</option>
                  </select>
                </div>
              </div>

              <!-- Itens do Checklist -->
              <div>
                <h4 class="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-3">Itens de Inspeção</h4>
                
                <div class="space-y-3 bg-slate-950/40 p-4 border border-slate-800 rounded-xl">
                  @for (item of checklistItems(); track item.name) {
                    <div class="flex items-center justify-between gap-4">
                      <span class="text-xs font-medium text-slate-300">{{ item.name }}</span>
                      
                      <div class="flex gap-2">
                        <button
                          type="button"
                          (click)="setItemStatus(item.name, 'OK')"
                          [class]="formData.items[item.name] === 'OK' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-slate-900 text-slate-500 border-slate-800'"
                          class="px-2 py-1 text-[10px] font-bold uppercase rounded border transition"
                        >
                          Conforme
                        </button>
                        <button
                          type="button"
                          (click)="setItemStatus(item.name, 'NOK')"
                          [class]="formData.items[item.name] === 'NOK' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-slate-900 text-slate-500 border-slate-800'"
                          class="px-2 py-1 text-[10px] font-bold uppercase rounded border transition"
                        >
                          Avaria
                        </button>
                      </div>
                    </div>
                  }
                </div>
              </div>

              <!-- Modal Footer -->
              <div class="flex justify-end gap-3 border-t border-slate-800 pt-4 mt-6">
                <button
                  type="button"
                  (click)="closeModal()"
                  class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg text-xs transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  [disabled]="loading() || !checkForm.valid"
                  class="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-lg text-xs transition disabled:opacity-50"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- Details View Modal -->
      @if (showDetailsModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div class="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
              <h3 class="text-base font-bold text-white">Detalhes da Vistoria</h3>
              <button (click)="closeDetailsModal()" class="text-slate-400 hover:text-white text-lg font-bold">&times;</button>
            </div>
            
            <div class="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div class="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span class="text-slate-500 block">Veículo</span>
                  <strong class="text-white">{{ activeChecklist().vehicle?.brand }} {{ activeChecklist().vehicle?.model }}</strong>
                </div>
                <div>
                  <span class="text-slate-500 block">Placa</span>
                  <strong class="text-white">{{ activeChecklist().vehicle?.plate }}</strong>
                </div>
                <div>
                  <span class="text-slate-500 block">Quilometragem</span>
                  <strong class="text-white">{{ activeChecklist().mileage }} Km</strong>
                </div>
                <div>
                  <span class="text-slate-500 block">Combustível</span>
                  <strong class="text-white">{{ getFuelLabel(activeChecklist().fuelLevel) }}</strong>
                </div>
              </div>

              <div class="border-t border-slate-800 pt-4">
                <span class="text-slate-500 block text-xs mb-2">Respostas da Inspeção</span>
                
                <div class="space-y-2">
                  @for (entry of getInspectionEntries(activeChecklist().items); track entry.key) {
                    <div class="flex justify-between items-center text-xs py-1.5 border-b border-slate-800/40">
                      <span class="text-slate-300">{{ entry.key }}</span>
                      <span
                        [class]="entry.val === 'OK' ? 'bg-emerald-950 text-emerald-400 border-emerald-500/20' : 'bg-red-950 text-red-400 border-red-500/20'"
                        class="px-2 py-0.5 rounded font-bold border text-[10px]"
                      >
                        {{ entry.val === 'OK' ? 'Conforme' : 'Avaria' }}
                      </span>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class ChecklistsComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly checklistsUrl = 'http://localhost:3000/checklists';
  private readonly vehiclesUrl = 'http://localhost:3000/vehicles';

  readonly checklists = signal<any[]>([]);
  readonly filteredChecklists = signal<any[]>([]);
  readonly vehicles = signal<any[]>([]);

  searchQuery = '';

  // Form List
  readonly checklistItems = signal([
    { name: 'Faróis e Lanternas' },
    { name: 'Pneus e Rodas' },
    { name: 'Nível do Óleo' },
    { name: 'Limpadores de Parabrisa' },
    { name: 'Lataria (Sem Riscos/Avarias)' },
    { name: 'Vidros e Retrovisores' },
    { name: 'Funcionamento do Ar-Condicionado' },
  ]);

  // Modal State
  readonly showModal = signal(false);
  readonly showDetailsModal = signal(false);
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  activeChecklist = signal<any>({});

  formData = {
    vehicleId: '',
    fuelLevel: '1/2',
    mileage: 0,
    items: {} as Record<string, string>,
  };

  ngOnInit(): void {
    this.loadChecklists();
    this.loadVehicles();
  }

  loadChecklists(): void {
    this.http.get<any[]>(this.checklistsUrl).subscribe({
      next: (data) => {
        this.checklists.set(data);
        this.filterChecklists();
      },
      error: (err) => console.error('Erro ao listar checklists', err),
    });
  }

  loadVehicles(): void {
    this.http.get<any[]>(this.vehiclesUrl).subscribe({
      next: (data) => this.vehicles.set(data),
      error: (err) => console.error('Erro ao listar veículos', err),
    });
  }

  filterChecklists(): void {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) {
      this.filteredChecklists.set(this.checklists());
      return;
    }

    const filtered = this.checklists().filter(
      (c) =>
        c.vehicle?.plate.toLowerCase().includes(query) ||
        c.inspector?.name.toLowerCase().includes(query)
    );
    this.filteredChecklists.set(filtered);
  }

  openModal(): void {
    // Inicializar checklist com todos os itens como 'OK' por padrão
    const defaultItems: Record<string, string> = {};
    this.checklistItems().forEach((item) => {
      defaultItems[item.name] = 'OK';
    });

    this.formData = {
      vehicleId: '',
      fuelLevel: '1/2',
      mileage: 0,
      items: defaultItems,
    };
    this.errorMessage.set(null);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  setItemStatus(name: string, status: string): void {
    this.formData.items[name] = status;
  }

  saveChecklist(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    const payload = {
      vehicleId: this.formData.vehicleId,
      fuelLevel: this.formData.fuelLevel,
      mileage: Number(this.formData.mileage),
      items: Object.entries(this.formData.items).map(([name, value]) => ({
        name,
        value,
      })),
      photos: [],
    };

    this.http.post(this.checklistsUrl, payload).subscribe({
      next: () => {
        this.loading.set(false);
        this.closeModal();
        this.loadChecklists();
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err?.error?.message || 'Falha ao salvar checklist.');
      },
    });
  }

  viewDetails(checklist: any): void {
    this.activeChecklist.set(checklist);
    this.showDetailsModal.set(true);
  }

  closeDetailsModal(): void {
    this.showDetailsModal.set(false);
  }

  getFuelLabel(level: string): string {
    switch (level) {
      case 'E': return 'Reserva (Vazio)';
      case '1/4': return '1/4 Tanque';
      case '1/2': return 'Meio Tanque';
      case '3/4': return '3/4 Tanque';
      case 'F': return 'Tanque Cheio';
      default: return level;
    }
  }

  getInspectionEntries(items: any): { key: string; val: any }[] {
    if (!items) return [];
    if (typeof items === 'string') {
      try {
        items = JSON.parse(items);
      } catch {
        return [];
      }
    }
    if (Array.isArray(items)) {
      return items.map((item: any) => ({ key: item.name, val: item.value }));
    }
    return Object.entries(items).map(([key, val]) => ({ key, val }));
  }
}
