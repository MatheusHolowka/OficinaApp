import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 class="text-2xl font-bold text-white tracking-tight">Veículos</h2>
          <p class="text-slate-400 text-sm mt-0.5">Gerencie os carros e frotas de clientes cadastrados.</p>
        </div>
        <button
          (click)="openModal()"
          class="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-lg shadow-lg shadow-purple-500/10 active:scale-[0.98] transition-all text-sm"
        >
          + Novo Veículo
        </button>
      </div>

      <!-- List Card -->
      <div class="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 space-y-4">
        <!-- Search bar -->
        <div class="flex max-w-md">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (ngModelChange)="filterVehicles()"
            placeholder="Pesquisar por placa, marca ou modelo..."
            class="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition text-sm"
          />
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                <th class="pb-3">Proprietário</th>
                <th class="pb-3">Placa</th>
                <th class="pb-3">Marca / Modelo</th>
                <th class="pb-3">Ano</th>
                <th class="pb-3">Cor</th>
                <th class="pb-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800 text-sm">
              @for (veh of filteredVehicles(); track veh.id) {
                <tr class="hover:bg-slate-800/20 transition-colors">
                  <td class="py-3.5">
                    <div class="font-semibold text-white">{{ veh.customer?.name }}</div>
                    <div class="text-xs text-slate-400">{{ veh.customer?.phone }}</div>
                  </td>
                  <td class="py-3.5">
                    <span class="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                      {{ veh.plate }}
                    </span>
                  </td>
                  <td class="py-3.5 text-slate-300 font-medium">{{ veh.brand }} {{ veh.model }}</td>
                  <td class="py-3.5 text-slate-400">{{ veh.year }}</td>
                  <td class="py-3.5 text-slate-400">{{ veh.color || '-' }}</td>
                  <td class="py-3.5 text-right space-x-2">
                    <button
                      (click)="openModal(veh)"
                      class="px-2.5 py-1 text-xs font-semibold rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="6" class="py-8 text-center text-slate-500">
                    Nenhum veículo encontrado.
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
                {{ isEditMode() ? 'Editar Veículo' : 'Novo Veículo' }}
              </h3>
              <button (click)="closeModal()" class="text-slate-400 hover:text-white text-lg font-bold">&times;</button>
            </div>

            <!-- Modal Body -->
            <form (ngSubmit)="saveVehicle()" #vehForm="ngForm" class="p-6 space-y-4">
              @if (errorMessage()) {
                <div class="p-3 rounded bg-red-950/50 border border-red-500/20 text-red-300 text-xs text-center">
                  {{ errorMessage() }}
                </div>
              }

              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Proprietário (Cliente)</label>
                <select
                  name="customerId"
                  [(ngModel)]="formData.customerId"
                  required
                  class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition text-sm"
                >
                  <option value="" disabled selected>Selecione um cliente...</option>
                  @for (c of customers(); track c.id) {
                    <option [value]="c.id">{{ c.name }} ({{ c.phone }})</option>
                  }
                </select>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Marca</label>
                  <input
                    type="text"
                    name="brand"
                    [(ngModel)]="formData.brand"
                    required
                    placeholder="Ex: Toyota"
                    class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition text-sm"
                  />
                </div>

                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Modelo</label>
                  <input
                    type="text"
                    name="model"
                    [(ngModel)]="formData.model"
                    required
                    placeholder="Ex: Corolla"
                    class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition text-sm"
                  />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Ano</label>
                  <input
                    type="number"
                    name="year"
                    [(ngModel)]="formData.year"
                    required
                    placeholder="Ex: 2022"
                    class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition text-sm"
                  />
                </div>

                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Placa</label>
                  <input
                    type="text"
                    name="plate"
                    [(ngModel)]="formData.plate"
                    required
                    placeholder="Ex: ABC-1234"
                    class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition text-sm uppercase"
                  />
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Cor (Opcional)</label>
                <input
                  type="text"
                  name="color"
                  [(ngModel)]="formData.color"
                  placeholder="Ex: Preto"
                  class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition text-sm"
                />
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
                  [disabled]="loading() || !vehForm.valid"
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
export class VehiclesComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly vehiclesUrl = 'http://localhost:3000/vehicles';
  private readonly customersUrl = 'http://localhost:3000/customers';

  readonly vehicles = signal<any[]>([]);
  readonly filteredVehicles = signal<any[]>([]);
  readonly customers = signal<any[]>([]);

  searchQuery = '';

  // Modal State
  readonly showModal = signal(false);
  readonly isEditMode = signal(false);
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  formData = {
    id: '',
    customerId: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    plate: '',
    color: '',
  };

  ngOnInit(): void {
    this.loadVehicles();
    this.loadCustomers();
  }

  loadVehicles(): void {
    this.http.get<any[]>(this.vehiclesUrl).subscribe({
      next: (data) => {
        this.vehicles.set(data);
        this.filterVehicles();
      },
      error: (err) => console.error('Erro ao listar veículos', err),
    });
  }

  loadCustomers(): void {
    this.http.get<any[]>(this.customersUrl).subscribe({
      next: (data) => this.customers.set(data),
      error: (err) => console.error('Erro ao listar clientes', err),
    });
  }

  filterVehicles(): void {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) {
      this.filteredVehicles.set(this.vehicles());
      return;
    }

    const filtered = this.vehicles().filter(
      (v) =>
        v.plate.toLowerCase().includes(query) ||
        v.brand.toLowerCase().includes(query) ||
        v.model.toLowerCase().includes(query) ||
        v.customer?.name.toLowerCase().includes(query)
    );
    this.filteredVehicles.set(filtered);
  }

  openModal(vehicle?: any): void {
    if (vehicle) {
      this.isEditMode.set(true);
      this.formData = {
        id: vehicle.id,
        customerId: vehicle.customerId,
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        plate: vehicle.plate,
        color: vehicle.color || '',
      };
    } else {
      this.isEditMode.set(false);
      this.formData = {
        id: '',
        customerId: '',
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        plate: '',
        color: '',
      };
    }
    this.errorMessage.set(null);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  saveVehicle(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    const payload = {
      customerId: this.formData.customerId,
      brand: this.formData.brand,
      model: this.formData.model,
      year: Number(this.formData.year),
      plate: this.formData.plate.toUpperCase(),
      color: this.formData.color || null,
    };

    const request$ = this.isEditMode()
      ? this.http.patch(`${this.vehiclesUrl}/${this.formData.id}`, payload)
      : this.http.post(this.vehiclesUrl, payload);

    request$.subscribe({
      next: () => {
        this.loading.set(false);
        this.closeModal();
        this.loadVehicles();
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(
          err?.error?.message || 'Falha ao salvar veículo. Verifique se a placa já está cadastrada.'
        );
      },
    });
  }
}
