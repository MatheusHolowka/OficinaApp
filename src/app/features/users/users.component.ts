import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [FormsModule, DatePipe],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 class="text-2xl font-bold text-white tracking-tight">Equipe & Usuários</h2>
          <p class="text-slate-400 text-sm mt-0.5">Gerencie os membros da equipe e suas permissões de acesso.</p>
        </div>
        <button
          (click)="openModal()"
          class="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-lg shadow-lg shadow-purple-500/10 active:scale-[0.98] transition-all text-sm"
        >
          + Novo Usuário
        </button>
      </div>

      <!-- List Card -->
      <div class="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 space-y-4">
        <!-- Search bar -->
        <div class="flex max-w-md">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (ngModelChange)="filterUsers()"
            placeholder="Pesquisar por nome ou e-mail..."
            class="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition text-sm"
          />
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                <th class="pb-3">Nome</th>
                <th class="pb-3">E-mail</th>
                <th class="pb-3">Função / Cargo</th>
                <th class="pb-3">Data de Cadastro</th>
                <th class="pb-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800 text-sm">
              @for (user of filteredUsers(); track user.id) {
                <tr class="hover:bg-slate-800/20 transition-colors">
                  <td class="py-3.5 font-semibold text-white">
                    <div class="flex items-center gap-2">
                      <div class="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-300">
                        {{ user.name.substring(0, 2).toUpperCase() }}
                      </div>
                      <span>{{ user.name }}</span>
                    </div>
                  </td>
                  <td class="py-3.5 text-slate-300">{{ user.email }}</td>
                  <td class="py-3.5">
                    <span
                      class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border"
                      [class]="getRoleClass(user.role)"
                    >
                      {{ getRoleLabel(user.role) }}
                    </span>
                  </td>
                  <td class="py-3.5 text-slate-400">{{ user.createdAt | date: 'dd/MM/yyyy' }}</td>
                  <td class="py-3.5 text-right space-x-2">
                    <button
                      (click)="openModal(user)"
                      class="px-2.5 py-1 text-xs font-semibold rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                    >
                      Editar
                    </button>
                    <button
                      (click)="deleteUser(user.id)"
                      class="px-2.5 py-1 text-xs font-semibold rounded bg-red-950/40 border border-red-500/20 hover:bg-red-900 text-red-300 hover:text-white transition"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5" class="py-8 text-center text-slate-500">
                    Nenhum usuário cadastrado na equipe.
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
                {{ isEditMode() ? 'Editar Usuário' : 'Novo Usuário' }}
              </h3>
              <button (click)="closeModal()" class="text-slate-400 hover:text-white text-lg font-bold">&times;</button>
            </div>

            <!-- Modal Body -->
            <form (ngSubmit)="saveUser()" #userForm="ngForm" class="p-6 space-y-4">
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
                  placeholder="Ex: Carlos Silva"
                  class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition text-sm"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">E-mail Corporativo</label>
                <input
                  type="email"
                  name="email"
                  [(ngModel)]="formData.email"
                  required
                  placeholder="Ex: carlos@oficina.com"
                  class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition text-sm"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Função / Nível de Acesso</label>
                <select
                  name="role"
                  [(ngModel)]="formData.role"
                  required
                  class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition text-sm"
                >
                  <option value="RECEPTIONIST">Recepcionista</option>
                  <option value="MECHANIC">Mecânico / Técnico</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Senha {{ isEditMode() ? '(Deixe em branco para manter a atual)' : 'Secreta' }}
                </label>
                <input
                  type="password"
                  name="password"
                  [(ngModel)]="formData.password"
                  [required]="!isEditMode()"
                  placeholder="••••••••"
                  minlength="6"
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
                  [disabled]="loading() || !userForm.valid"
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
export class UsersComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/users`;

  readonly users = signal<any[]>([]);
  readonly filteredUsers = signal<any[]>([]);

  searchQuery = '';

  // Modal State
  readonly showModal = signal(false);
  readonly isEditMode = signal(false);
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  formData = {
    id: '',
    name: '',
    email: '',
    role: 'RECEPTIONIST',
    password: '',
  };

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.users.set(data);
        this.filterUsers();
      },
      error: (err) => console.error('Erro ao listar usuários', err),
    });
  }

  filterUsers(): void {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) {
      this.filteredUsers.set(this.users());
      return;
    }

    const filtered = this.users().filter(
      (u) =>
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query)
    );
    this.filteredUsers.set(filtered);
  }

  openModal(user?: any): void {
    if (user) {
      this.isEditMode.set(true);
      this.formData = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        password: '',
      };
    } else {
      this.isEditMode.set(false);
      this.formData = {
        id: '',
        name: '',
        email: '',
        role: 'RECEPTIONIST',
        password: '',
      };
    }
    this.errorMessage.set(null);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  saveUser(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    const payload: any = {
      name: this.formData.name,
      email: this.formData.email,
      role: this.formData.role,
    };

    if (this.formData.password) {
      payload.password = this.formData.password;
    }

    const request$ = this.isEditMode()
      ? this.http.patch(`${this.apiUrl}/${this.formData.id}`, payload)
      : this.http.post(this.apiUrl, payload);

    request$.subscribe({
      next: () => {
        this.loading.set(false);
        this.closeModal();
        this.loadUsers();
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err?.error?.message || 'Falha ao salvar usuário.');
      },
    });
  }

  deleteUser(id: string): void {
    if (!confirm('Deseja realmente excluir este usuário?')) return;

    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => this.loadUsers(),
      error: (err) => console.error('Erro ao excluir usuário', err),
    });
  }

  getRoleClass(role: string): string {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-950/40 text-purple-300 border-purple-700/30';
      case 'MECHANIC':
        return 'bg-blue-950/40 text-blue-300 border-blue-700/30';
      case 'RECEPTIONIST':
        return 'bg-slate-800 text-slate-300 border-slate-700';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  }

  getRoleLabel(role: string): string {
    switch (role) {
      case 'ADMIN':
        return 'Administrador';
      case 'MECHANIC':
        return 'Mecânico / Técnico';
      case 'RECEPTIONIST':
        return 'Recepcionista';
      default:
        return role;
    }
  }
}
