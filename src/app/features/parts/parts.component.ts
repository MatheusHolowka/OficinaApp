import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-parts',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 class="text-2xl font-bold text-white tracking-tight">Catálogo de Peças & Estoque</h2>
          <p class="text-slate-400 text-sm mt-0.5">Gerencie os materiais, peças de reposição e níveis de estoque.</p>
        </div>
        <button
          (click)="openModal()"
          class="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-lg shadow-lg shadow-purple-500/10 active:scale-[0.98] transition-all text-sm"
        >
          + Nova Peça
        </button>
      </div>

      <!-- List Card -->
      <div class="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 space-y-4">
        <!-- Search bar -->
        <div class="flex max-w-md">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (ngModelChange)="filterParts()"
            placeholder="Pesquisar por nome ou SKU..."
            class="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition text-sm"
          />
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                <th class="pb-3">Nome</th>
                <th class="pb-3">SKU</th>
                <th class="pb-3 text-center">Quantidade em Estoque</th>
                <th class="pb-3 text-right">Preço Unitário</th>
                <th class="pb-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800 text-sm">
              @for (pt of filteredParts(); track pt.id) {
                <tr class="hover:bg-slate-800/20 transition-colors">
                  <td class="py-3.5 font-semibold text-white">{{ pt.name }}</td>
                  <td class="py-3.5 text-slate-400 font-mono text-xs">{{ pt.sku || '-' }}</td>
                  <td class="py-3.5 text-center">
                    <span
                      [class]="pt.stock > 5 ? 'bg-slate-950 text-slate-300 border-slate-800' : 'bg-red-950/40 text-red-400 border-red-500/20'"
                      class="px-2 py-1 rounded border text-xs font-semibold"
                    >
                      {{ pt.stock }} un
                    </span>
                  </td>
                  <td class="py-3.5 text-right font-bold text-slate-200">
                    R$ {{ Number(pt.price).toFixed(2) }}
                  </td>
                  <td class="py-3.5 text-right space-x-2">
                    <button
                      (click)="openModal(pt)"
                      class="px-2.5 py-1 text-xs font-semibold rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                    >
                      Editar
                    </button>
                    <button
                      (click)="deletePart(pt.id)"
                      class="px-2.5 py-1 text-xs font-semibold rounded bg-red-950/40 border border-red-500/20 hover:bg-red-900 text-red-300 hover:text-white transition"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5" class="py-8 text-center text-slate-500">
                    Nenhuma peça encontrada no catálogo.
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
                {{ isEditMode() ? 'Editar Peça' : 'Nova Peça' }}
              </h3>
              <button (click)="closeModal()" class="text-slate-400 hover:text-white text-lg font-bold">&times;</button>
            </div>

            <!-- Modal Body -->
            <form (ngSubmit)="savePart()" #ptForm="ngForm" class="p-6 space-y-4">
              @if (errorMessage()) {
                <div class="p-3 rounded bg-red-950/50 border border-red-500/20 text-red-300 text-xs text-center">
                  {{ errorMessage() }}
                </div>
              }

              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Nome da Peça</label>
                <input
                  type="text"
                  name="name"
                  [(ngModel)]="formData.name"
                  required
                  placeholder="Ex: Pastilha de Freio Dianteira"
                  class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition text-sm"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">SKU (Opcional)</label>
                <input
                  type="text"
                  name="sku"
                  [(ngModel)]="formData.sku"
                  placeholder="Ex: PST-FR-02"
                  class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition text-sm font-mono uppercase"
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Preço (R$)</label>
                  <input
                    type="number"
                    name="price"
                    [(ngModel)]="formData.price"
                    required
                    placeholder="89.90"
                    min="0"
                    step="0.01"
                    class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition text-sm"
                  />
                </div>

                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Quantidade Inicial</label>
                  <input
                    type="number"
                    name="stock"
                    [(ngModel)]="formData.stock"
                    required
                    placeholder="10"
                    min="0"
                    class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition text-sm text-center"
                  />
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
                  [disabled]="loading() || !ptForm.valid"
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
export class PartsComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/parts`;

  readonly parts = signal<any[]>([]);
  readonly filteredParts = signal<any[]>([]);

  searchQuery = '';

  // Modal State
  readonly showModal = signal(false);
  readonly isEditMode = signal(false);
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  formData = {
    id: '',
    name: '',
    sku: '',
    price: 0,
    stock: 0,
  };

  protected readonly Number = Number;

  ngOnInit(): void {
    this.loadParts();
  }

  loadParts(): void {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.parts.set(data);
        this.filterParts();
      },
      error: (err) => console.error('Erro ao listar peças', err),
    });
  }

  filterParts(): void {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) {
      this.filteredParts.set(this.parts());
      return;
    }

    const filtered = this.parts().filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        (p.sku && p.sku.toLowerCase().includes(query))
    );
    this.filteredParts.set(filtered);
  }

  openModal(part?: any): void {
    if (part) {
      this.isEditMode.set(true);
      this.formData = {
        id: part.id,
        name: part.name,
        sku: part.sku || '',
        price: Number(part.price),
        stock: Number(part.stock),
      };
    } else {
      this.isEditMode.set(false);
      this.formData = {
        id: '',
        name: '',
        sku: '',
        price: 0,
        stock: 0,
      };
    }
    this.errorMessage.set(null);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  savePart(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    const payload = {
      name: this.formData.name,
      sku: this.formData.sku || null,
      price: Number(this.formData.price),
      stock: Number(this.formData.stock),
    };

    const request$ = this.isEditMode()
      ? this.http.patch(`${this.apiUrl}/${this.formData.id}`, payload)
      : this.http.post(this.apiUrl, payload);

    request$.subscribe({
      next: () => {
        this.loading.set(false);
        this.closeModal();
        this.loadParts();
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err?.error?.message || 'Falha ao salvar peça.');
      },
    });
  }

  deletePart(id: string): void {
    if (!confirm('Deseja realmente excluir esta peça do catálogo?')) return;

    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => this.loadParts(),
      error: (err) => console.error('Erro ao excluir peça', err),
    });
  }
}
