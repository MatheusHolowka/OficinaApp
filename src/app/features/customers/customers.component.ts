import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 class="text-2xl font-bold text-white tracking-tight">Clientes</h2>
          <p class="text-slate-400 text-sm mt-0.5">Gerencie os proprietários de veículos cadastrados na oficina.</p>
        </div>
        <button
          (click)="openModal()"
          class="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-lg shadow-lg shadow-purple-500/10 active:scale-[0.98] transition-all text-sm"
        >
          + Novo Cliente
        </button>
      </div>

      <!-- List Card -->
      <div class="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 space-y-4">
        <!-- Search bar -->
        <div class="flex max-w-md">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (ngModelChange)="filterCustomers()"
            placeholder="Pesquisar por nome ou telefone..."
            class="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition text-sm"
          />
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                <th class="pb-3">Nome</th>
                <th class="pb-3">Telefone</th>
                <th class="pb-3">E-mail</th>
                <th class="pb-3">Documento</th>
                <th class="pb-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800 text-sm">
              @for (cust of filteredCustomers(); track cust.id) {
                <tr class="hover:bg-slate-800/20 transition-colors">
                  <td class="py-3.5 font-semibold text-white">{{ cust.name }}</td>
                  <td class="py-3.5 text-slate-300">{{ cust.phone }}</td>
                  <td class="py-3.5 text-slate-400">{{ cust.email || '-' }}</td>
                  <td class="py-3.5 text-slate-400">{{ cust.document || '-' }}</td>
                  <td class="py-3.5 text-right space-x-2">
                    <button
                      (click)="openModal(cust)"
                      class="px-2.5 py-1 text-xs font-semibold rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5" class="py-8 text-center text-slate-500">
                    Nenhum cliente encontrado.
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
                {{ isEditMode() ? 'Editar Cliente' : 'Novo Cliente' }}
              </h3>
              <button (click)="closeModal()" class="text-slate-400 hover:text-white text-lg font-bold">&times;</button>
            </div>

            <!-- Modal Body -->
            <form (ngSubmit)="saveCustomer()" #custForm="ngForm" class="p-6 space-y-4">
              @if (errorMessage()) {
                <div class="p-3 rounded bg-red-950/50 border border-red-500/20 text-red-300 text-xs text-center">
                  {{ errorMessage() }}
                </div>
              }

              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Nome Completo</label>
                <input
                  type="text"
                  name="name"
                  [(ngModel)]="formData.name"
                  required
                  placeholder="Nome do cliente"
                  class="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition text-sm"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Telefone</label>
                <input
                  type="text"
                  name="phone"
                  [(ngModel)]="formData.phone"
                  required
                  placeholder="(11) 99999-9999"
                  class="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition text-sm"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">E-mail (Opcional)</label>
                <input
                  type="email"
                  name="email"
                  [(ngModel)]="formData.email"
                  placeholder="cliente@email.com"
                  class="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition text-sm"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Documento / CPF (Opcional)</label>
                <input
                  type="text"
                  name="document"
                  [(ngModel)]="formData.document"
                  placeholder="123.456.789-00"
                  class="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition text-sm"
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
                  [disabled]="loading() || !custForm.valid"
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
export class CustomersComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/customers`;

  readonly customers = signal<any[]>([]);
  readonly filteredCustomers = signal<any[]>([]);

  searchQuery = '';

  // Modal State
  readonly showModal = signal(false);
  readonly isEditMode = signal(false);
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  formData = {
    id: '',
    name: '',
    phone: '',
    email: '',
    document: '',
  };

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.customers.set(data);
        this.filterCustomers();
      },
      error: (err) => console.error('Erro ao listar clientes', err),
    });
  }

  filterCustomers(): void {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) {
      this.filteredCustomers.set(this.customers());
      return;
    }

    const filtered = this.customers().filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.phone.toLowerCase().includes(query) ||
        (c.document && c.document.toLowerCase().includes(query))
    );
    this.filteredCustomers.set(filtered);
  }

  openModal(customer?: any): void {
    if (customer) {
      this.isEditMode.set(true);
      this.formData = {
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        email: customer.email || '',
        document: customer.document || '',
      };
    } else {
      this.isEditMode.set(false);
      this.formData = {
        id: '',
        name: '',
        phone: '',
        email: '',
        document: '',
      };
    }
    this.errorMessage.set(null);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  saveCustomer(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    const payload = {
      name: this.formData.name,
      phone: this.formData.phone,
      email: this.formData.email || null,
      document: this.formData.document || null,
    };

    const request$ = this.isEditMode()
      ? this.http.patch(`${this.apiUrl}/${this.formData.id}`, payload)
      : this.http.post(this.apiUrl, payload);

    request$.subscribe({
      next: () => {
        this.loading.set(false);
        this.closeModal();
        this.loadCustomers();
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(
          err?.error?.message || 'Falha ao salvar cliente. Verifique se o documento já está cadastrado.'
        );
      },
    });
  }
}
