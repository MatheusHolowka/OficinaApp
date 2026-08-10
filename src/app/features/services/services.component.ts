import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 class="text-2xl font-bold text-white tracking-tight">Catálogo de Serviços</h2>
          <p class="text-slate-400 text-sm mt-0.5">Gerencie os serviços e mão de obra oferecidos pela sua oficina.</p>
        </div>
        <button
          (click)="openModal()"
          class="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-lg shadow-lg shadow-purple-500/10 active:scale-[0.98] transition-all text-sm"
        >
          + Novo Serviço
        </button>
      </div>

      <!-- List Card -->
      <div class="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 space-y-4">
        <!-- Search bar -->
        <div class="flex max-w-md">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (ngModelChange)="filterServices()"
            placeholder="Pesquisar por nome do serviço..."
            class="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition text-sm"
          />
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                <th class="pb-3">Nome</th>
                <th class="pb-3">Descrição</th>
                <th class="pb-3 text-right">Preço Base</th>
                <th class="pb-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800 text-sm">
              @for (svc of filteredServices(); track svc.id) {
                <tr class="hover:bg-slate-800/20 transition-colors">
                  <td class="py-3.5 font-semibold text-white">{{ svc.name }}</td>
                  <td class="py-3.5 text-slate-400 max-w-xs truncate" [title]="svc.description">{{ svc.description || '-' }}</td>
                  <td class="py-3.5 text-right font-bold text-slate-200">
                    R$ {{ Number(svc.basePrice).toFixed(2) }}{{ svc.isHourly ? '/h' : '' }}
                  </td>
                  <td class="py-3.5 text-right space-x-2">
                    <button
                      (click)="openModal(svc)"
                      class="px-2.5 py-1 text-xs font-semibold rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                    >
                      Editar
                    </button>
                    <button
                      (click)="deleteService(svc.id)"
                      class="px-2.5 py-1 text-xs font-semibold rounded bg-red-950/40 border border-red-500/20 hover:bg-red-900 text-red-300 hover:text-white transition"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="4" class="py-8 text-center text-slate-500">
                    Nenhum serviço encontrado no catálogo.
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
          <div class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <!-- Modal Header -->
            <div class="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
              <h3 class="text-base font-bold text-white">
                {{ isEditMode() ? 'Editar Serviço' : 'Novo Serviço' }}
              </h3>
              <button (click)="closeModal()" class="text-slate-400 hover:text-white text-lg font-bold">&times;</button>
            </div>

            <!-- Modal Body -->
            <form (ngSubmit)="saveService()" #svcForm="ngForm" class="p-6 space-y-4">
              @if (errorMessage()) {
                <div class="p-3 rounded bg-red-950/50 border border-red-500/20 text-red-300 text-xs text-center">
                  {{ errorMessage() }}
                </div>
              }

              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Nome do Serviço</label>
                <input
                  type="text"
                  name="name"
                  [(ngModel)]="formData.name"
                  required
                  placeholder="Ex: Alinhamento e Balanceamento"
                  class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition text-sm"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Preço Base (R$)</label>
                <input
                  type="number"
                  name="basePrice"
                  [(ngModel)]="formData.basePrice"
                  required
                  placeholder="150.00"
                  min="0"
                  step="0.01"
                  class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition text-sm"
                />
              </div>

              <div class="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  id="isHourly"
                  name="isHourly"
                  [(ngModel)]="formData.isHourly"
                  class="w-4 h-4 rounded bg-slate-950 border-slate-800 text-purple-600 focus:ring-purple-500 focus:ring-offset-0"
                />
                <label for="isHourly" class="text-xs font-semibold uppercase tracking-wider text-slate-400 select-none cursor-pointer">Cobrar serviço por hora</label>
              </div>

              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Descrição (Opcional)</label>
                <textarea
                  name="description"
                  [(ngModel)]="formData.description"
                  placeholder="Descreva os detalhes do serviço oferecido..."
                  rows="3"
                  class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition text-sm resize-none"
                ></textarea>
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
                  [disabled]="loading() || !svcForm.valid"
                  class="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-lg text-xs transition disabled:opacity-50"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
})
export class ServicesComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/services`;

  readonly services = signal<any[]>([]);
  readonly filteredServices = signal<any[]>([]);

  searchQuery = '';

  // Modal State
  readonly showModal = signal(false);
  readonly isEditMode = signal(false);
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  formData = {
    id: '',
    name: '',
    description: '',
    basePrice: 0,
    isHourly: false,
  };

  protected readonly Number = Number;

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.services.set(data);
        this.filterServices();
      },
      error: (err) => console.error('Erro ao listar serviços', err),
    });
  }

  filterServices(): void {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) {
      this.filteredServices.set(this.services());
      return;
    }

    const filtered = this.services().filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        (s.description && s.description.toLowerCase().includes(query))
    );
    this.filteredServices.set(filtered);
  }

  openModal(service?: any): void {
    if (service) {
      this.isEditMode.set(true);
      this.formData = {
        id: service.id,
        name: service.name,
        description: service.description || '',
        basePrice: Number(service.basePrice),
        isHourly: !!service.isHourly,
      };
    } else {
      this.isEditMode.set(false);
      this.formData = {
        id: '',
        name: '',
        description: '',
        basePrice: 0,
        isHourly: false,
      };
    }
    this.errorMessage.set(null);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  saveService(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    const payload = {
      name: this.formData.name,
      description: this.formData.description || null,
      basePrice: Number(this.formData.basePrice),
      isHourly: !!this.formData.isHourly,
    };

    const request$ = this.isEditMode()
      ? this.http.patch(`${this.apiUrl}/${this.formData.id}`, payload)
      : this.http.post(this.apiUrl, payload);

    request$.subscribe({
      next: () => {
        this.loading.set(false);
        this.closeModal();
        this.loadServices();
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err?.error?.message || 'Falha ao salvar serviço.');
      },
    });
  }

  deleteService(id: string): void {
    if (!confirm('Deseja realmente excluir este serviço do catálogo?')) return;

    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => this.loadServices(),
      error: (err) => console.error('Erro ao excluir serviço', err),
    });
  }
}
