import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';

interface SelectedService {
  serviceId: string;
  quantity: number;
}

interface SelectedPart {
  partId: string;
  quantity: number;
}

@Component({
  selector: 'app-work-orders',
  standalone: true,
  imports: [FormsModule, DatePipe],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 class="text-2xl font-bold text-white tracking-tight">Ordens de Serviço (OS)</h2>
          <p class="text-slate-400 text-sm mt-0.5">Gerenciamento completo do ciclo de reparo, peças e serviços realizados.</p>
        </div>
        <button
          (click)="openModal()"
          class="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-lg shadow-lg shadow-purple-500/10 active:scale-[0.98] transition-all text-sm"
        >
          + Nova Ordem de Serviço
        </button>
      </div>

      <!-- List Card -->
      <div class="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 space-y-4">
        <!-- Controls Bar -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <!-- Search bar -->
          <div class="flex w-full md:max-w-md">
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (ngModelChange)="filterWorkOrders()"
              placeholder="Pesquisar por placa ou cliente..."
              class="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition text-sm"
            />
          </div>

          <!-- Configuration Toggle for Print -->
          <div class="flex items-center gap-2 bg-slate-950/80 px-4 py-2.5 border border-slate-800 rounded-lg text-sm text-slate-300">
            <input
              type="checkbox"
              id="toggleHourlyPrint"
              [ngModel]="showHourlyInPrint()"
              (ngModelChange)="showHourlyInPrint.set($event)"
              class="w-4 h-4 rounded bg-slate-950 border-slate-800 text-purple-600 focus:ring-purple-500 focus:ring-offset-0 cursor-pointer"
            />
            <label for="toggleHourlyPrint" class="select-none cursor-pointer font-medium text-xs text-slate-400">EXIBIR COBRANÇA POR HORA NO PDF</label>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                <th class="pb-3">OS ID / Data</th>
                <th class="pb-3">Cliente</th>
                <th class="pb-3">Veículo</th>
                <th class="pb-3 text-center">Vistoria</th>
                <th class="pb-3 text-center">Status</th>
                <th class="pb-3 text-right">Total</th>
                <th class="pb-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800 text-sm">
              @for (wo of filteredWorkOrders(); track wo.id) {
                <tr class="hover:bg-slate-800/20 transition-colors">
                  <td class="py-3.5">
                    <span class="text-xs font-mono text-slate-500 block truncate w-24">{{ wo.id.substring(0, 8) }}...</span>
                    <span class="text-xs text-slate-400">{{ wo.createdAt | date: 'dd/MM/yyyy' }}</span>
                  </td>
                  <td class="py-3.5">
                    <div class="font-semibold text-white">{{ wo.customer?.name }}</div>
                  </td>
                  <td class="py-3.5">
                    <div class="text-white font-medium">{{ vehLabel(wo.vehicle) }}</div>
                    <div class="text-xs text-slate-400 font-mono">Placa: {{ wo.vehicle?.plate }}</div>
                  </td>
                  <td class="py-3.5 text-center">
                    @if (wo.checklistId) {
                      <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950/40 text-purple-300 border border-purple-700/30">
                        Viculada
                      </span>
                    } @else {
                      <span class="text-slate-500 text-xs">-</span>
                    }
                  </td>
                  <td class="py-3.5 text-center">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium border" [class]="getStatusClass(wo.status)">
                      {{ getStatusLabel(wo.status) }}
                    </span>
                  </td>
                  <td class="py-3.5 text-right font-bold text-slate-200">
                    R$ {{ Number(wo.totalAmount).toFixed(2) }}
                  </td>
                  <td class="py-3.5 text-right space-x-2">
                    <button
                      (click)="printWorkOrder(wo)"
                      class="px-2.5 py-1 text-xs font-semibold rounded bg-purple-600 hover:bg-purple-500 text-white transition shadow-sm"
                    >
                      Imprimir
                    </button>
                    <button
                      (click)="openModal(wo)"
                      class="px-2.5 py-1 text-xs font-semibold rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                    >
                      Editar
                    </button>
                    <button
                      (click)="deleteWorkOrder(wo.id)"
                      class="px-2.5 py-1 text-xs font-semibold rounded bg-red-950/40 border border-red-500/20 hover:bg-red-900 text-red-300 hover:text-white transition"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="7" class="py-8 text-center text-slate-500">
                    Nenhuma ordem de serviço cadastrada.
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
          <div class="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <!-- Modal Header -->
            <div class="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
              <h3 class="text-base font-bold text-white">
                {{ isEditMode() ? 'Editar Ordem de Serviço' : 'Nova Ordem de Serviço' }}
              </h3>
              <button (click)="closeModal()" class="text-slate-400 hover:text-white text-lg font-bold">&times;</button>
            </div>

            <!-- Modal Body -->
            <form (ngSubmit)="saveWorkOrder()" #woForm="ngForm" class="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              @if (errorMessage()) {
                <div class="p-3 rounded bg-red-950/50 border border-red-500/20 text-red-300 text-xs text-center">
                  {{ errorMessage() }}
                </div>
              }

              <!-- Cliente / Carro -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Cliente</label>
                  <select
                    name="customerId"
                    [(ngModel)]="formData.customerId"
                    (ngModelChange)="onCustomerChange()"
                    required
                    [disabled]="isEditMode()"
                    class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition text-sm disabled:opacity-50"
                  >
                    <option value="" disabled selected>Selecione um cliente...</option>
                    @for (c of customers(); track c.id) {
                      <option [value]="c.id">{{ c.name }}</option>
                    }
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Veículo</label>
                  <select
                    name="vehicleId"
                    [(ngModel)]="formData.vehicleId"
                    (ngModelChange)="onVehicleChange($event)"
                    required
                    [disabled]="isEditMode() || !formData.customerId"
                    class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition text-sm disabled:opacity-50"
                  >
                    <option value="" disabled selected>Selecione um veículo...</option>
                    @for (v of customerVehicles(); track v.id) {
                      <option [value]="v.id">{{ v.brand }} {{ v.model }} ({{ v.plate }})</option>
                    }
                  </select>
                </div>
              </div>

              <!-- Checklist Selection & Status -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Vincular Vistoria / Checklist</label>
                  <select
                    name="checklistId"
                    [(ngModel)]="formData.checklistId"
                    [disabled]="!formData.vehicleId"
                    class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition text-sm disabled:opacity-50"
                  >
                    <option value="">Nenhum checklist vinculado</option>
                    @for (ch of customerChecklists(); track ch.id) {
                      <option [value]="ch.id">Checklist #{{ ch.id.substring(0, 8).toUpperCase() }} (KM: {{ ch.mileage }} | {{ ch.createdAt | date: 'dd/MM/yyyy' }})</option>
                    }
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Status da OS</label>
                  <select
                    name="status"
                    [(ngModel)]="formData.status"
                    required
                    class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition text-sm"
                  >
                    <option value="QUEUED">Na fila</option>
                    <option value="ESTIMATING">Em Orçamento</option>
                    <option value="APPROVED">Aprovado / Aguardando Execução</option>
                    <option value="EXECUTING">Em Execução</option>
                    <option value="AWAITING_PARTS">Aguardando Peças</option>
                    <option value="COMPLETED">Finalizado</option>
                    <option value="DELIVERED">Entregue</option>
                    <option value="CANCELLED">Cancelado</option>
                  </select>
                </div>
              </div>

              <!-- Catálogo de Serviços Integrados -->
              <div class="border-t border-slate-800/80 pt-4">
                <div class="flex justify-between items-center mb-3">
                  <h4 class="text-xs font-semibold text-purple-400 uppercase tracking-wider">Serviços Executados</h4>
                  <button
                    type="button"
                    (click)="addService()"
                    class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded text-[10px] uppercase transition"
                  >
                    + Adicionar Serviço
                  </button>
                </div>

                <div class="space-y-2">
                  @for (s of formData.services; track $index) {
                    <div class="flex items-center gap-3 bg-slate-950/40 p-3 rounded-lg border border-slate-800/50">
                      <div class="flex-1">
                        <select
                          [(ngModel)]="s.serviceId"
                          (ngModelChange)="triggerRecalculation()"
                          name="service-{{$index}}"
                          required
                          class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none text-xs"
                        >
                          <option value="" disabled selected>Selecione o serviço...</option>
                          @for (item of services(); track item.id) {
                            <option [value]="item.id">{{ item.name }} (R$ {{ Number(item.basePrice).toFixed(2) }}{{ item.isHourly ? '/h' : '' }})</option>
                          }
                        </select>
                      </div>

                      <div class="w-24">
                        <input
                          type="number"
                          [(ngModel)]="s.quantity"
                          (ngModelChange)="triggerRecalculation()"
                          name="service-qty-{{$index}}"
                          min="0.1"
                          step="0.1"
                          required
                          [placeholder]="isServiceHourly(s.serviceId) ? 'Horas' : 'Qtd'"
                          class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-slate-200 text-xs text-center"
                        />
                      </div>

                      <button
                        type="button"
                        (click)="removeService($index)"
                        class="p-1.5 rounded hover:bg-red-950/30 text-slate-500 hover:text-red-400 transition"
                      >
                        Remover
                      </button>
                    </div>
                  }
                </div>
              </div>

              <!-- Catálogo de Peças Integradas -->
              <div class="border-t border-slate-800/80 pt-4">
                <div class="flex justify-between items-center mb-3">
                  <h4 class="text-xs font-semibold text-purple-400 uppercase tracking-wider">Peças / Materiais</h4>
                  <button
                    type="button"
                    (click)="addPart()"
                    class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded text-[10px] uppercase transition"
                  >
                    + Adicionar Peça
                  </button>
                </div>

                <div class="space-y-2">
                  @for (p of formData.parts; track $index) {
                    <div class="flex items-center gap-3 bg-slate-950/40 p-3 rounded-lg border border-slate-800/50">
                      <div class="flex-1">
                        <select
                          [(ngModel)]="p.partId"
                          (ngModelChange)="triggerRecalculation()"
                          name="part-{{$index}}"
                          required
                          class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none text-xs"
                        >
                          <option value="" disabled selected>Selecione a peça...</option>
                          @for (item of parts(); track item.id) {
                            <option [value]="item.id">{{ item.name }} (R$ {{ Number(item.price).toFixed(2) }})</option>
                          }
                        </select>
                      </div>

                      <div class="w-24">
                        <input
                          type="number"
                          [(ngModel)]="p.quantity"
                          (ngModelChange)="triggerRecalculation()"
                          name="part-qty-{{$index}}"
                          min="1"
                          required
                          placeholder="Qtd"
                          class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-slate-200 text-xs text-center"
                        />
                      </div>

                      <button
                        type="button"
                        (click)="removePart($index)"
                        class="p-1.5 rounded hover:bg-red-950/30 text-slate-500 hover:text-red-400 transition"
                      >
                        Remover
                      </button>
                    </div>
                  }
                </div>
              </div>

              <!-- Total Preview -->
              <div class="border-t border-slate-800 pt-4 flex justify-between items-center">
                <span class="text-sm font-semibold text-slate-400">Total Previsto:</span>
                <span class="text-xl font-bold text-purple-400">R$ {{ calculatedTotal().toFixed(2) }}</span>
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
                  [disabled]="loading() || !woForm.valid"
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

    <!-- Print Layout Section -->
    @if (activePrintWorkOrder()) {
      <div id="print-section" class="p-10 text-black bg-white font-sans text-xs leading-relaxed max-w-[21cm]">
        <!-- Brand Header Section -->
        <div class="flex justify-between items-start border-b border-gray-300 pb-4 mb-6">
          <div class="space-y-1">
            <h1 class="text-xl font-extrabold uppercase tracking-tight text-indigo-950">{{ authService.currentTenant()?.name || 'OFICINA AUTOMOTIVA' }}</h1>
            <p class="text-[10px] text-gray-500 font-medium">CNPJ: 29.497.181/0001-95 | Inscr. Est.: Isento</p>
            <p class="text-[10px] text-gray-500">Av. Otávio Souza Cruz, 52 - Centro, Sorriso - MT</p>
            <p class="text-[10px] text-gray-500">Tel: (66) 99624-4733 | Email: contato@oficina.com</p>
          </div>
          <div class="text-right space-y-1 border-l border-gray-200 pl-6">
            <h2 class="text-sm font-bold uppercase tracking-wider text-gray-700">
              {{ isBudget(activePrintWorkOrder()) ? 'Orçamento de Serviços' : 'Ordem de Serviço' }}
            </h2>
            <p class="text-base font-bold font-mono text-indigo-900">#{{ activePrintWorkOrder().id.substring(0, 8).toUpperCase() }}</p>
            <p class="text-[10px] text-gray-500">Data: {{ activePrintWorkOrder().createdAt | date: 'dd/MM/yyyy HH:mm' }}</p>
            <p class="text-[10px] text-gray-500">Status: <span class="font-bold uppercase text-indigo-900">{{ getStatusLabel(activePrintWorkOrder().status) }}</span></p>
          </div>
        </div>

        <!-- Customer & Vehicle Block -->
        <div class="grid grid-cols-2 gap-6 border border-gray-200 rounded-lg p-4 mb-6 bg-gray-50/50">
          <div>
            <h3 class="font-bold border-b border-gray-200 pb-1 mb-2 uppercase text-[9px] tracking-wider text-indigo-900">Dados do Cliente</h3>
            <div class="space-y-1 text-[10px]">
              <p><strong>Nome:</strong> <span class="text-gray-700">{{ activePrintWorkOrder().customer?.name || '-' }}</span></p>
              <p><strong>Telefone:</strong> <span class="text-gray-700">{{ activePrintWorkOrder().customer?.phone || '-' }}</span></p>
              <p><strong>E-mail:</strong> <span class="text-gray-700 font-mono">{{ activePrintWorkOrder().customer?.email || '-' }}</span></p>
              <p><strong>CPF/CNPJ:</strong> <span class="text-gray-700">{{ activePrintWorkOrder().customer?.document || '-' }}</span></p>
            </div>
          </div>
          <div>
            <h3 class="font-bold border-b border-gray-200 pb-1 mb-2 uppercase text-[9px] tracking-wider text-indigo-900">Dados do Veículo</h3>
            <div class="space-y-1 text-[10px]">
              <p><strong>Placa:</strong> <span class="font-mono font-bold uppercase text-gray-800 border border-gray-300 bg-white px-1.5 py-0.5 rounded text-[11px]">{{ activePrintWorkOrder().vehicle?.plate || '-' }}</span></p>
              <p class="mt-1.5"><strong>Marca/Modelo:</strong> <span class="text-gray-700">{{ activePrintWorkOrder().vehicle?.brand }} {{ activePrintWorkOrder().vehicle?.model }}</span></p>
              <p><strong>Ano Fabr./Modelo:</strong> <span class="text-gray-700">{{ activePrintWorkOrder().vehicle?.year || '-' }}</span></p>
              <p><strong>Cor/KM:</strong> <span class="text-gray-700">{{ activePrintWorkOrder().vehicle?.color || '-' }} / {{ activePrintWorkOrder().checklist?.mileage ? activePrintWorkOrder().checklist.mileage + ' km' : '-' }}</span></p>
            </div>
          </div>
        </div>

        <!-- Linked Checklist Block -->
        @if (activePrintWorkOrder().checklist) {
          <div class="border border-gray-200 rounded-lg p-4 mb-6 bg-gray-50/50">
            <h3 class="font-bold border-b border-gray-200 pb-1 mb-2 uppercase text-[9px] tracking-wider text-indigo-900">
              Vistoria de Entrada Vinculada (#{{ activePrintWorkOrder().checklist.id.substring(0, 8).toUpperCase() }})
            </h3>
            <div class="flex justify-between items-center text-[10px] mb-3 text-gray-600 bg-white border border-gray-100 p-2 rounded">
              <span><strong>Combustível:</strong> {{ getFuelLevelLabel(activePrintWorkOrder().checklist.fuelLevel) }}</span>
              <span><strong>Quilometragem:</strong> {{ activePrintWorkOrder().checklist.mileage }} KM</span>
              <span><strong>Data Vistoria:</strong> {{ activePrintWorkOrder().checklist.createdAt | date: 'dd/MM/yyyy HH:mm' }}</span>
            </div>
            <!-- Checklist items status grid -->
            <div class="grid grid-cols-2 gap-x-6 gap-y-1 text-[10px]">
              @for (item of getInspectionEntries(activePrintWorkOrder().checklist.items); track item.key) {
                <div class="flex justify-between items-center border-b border-gray-100 py-1">
                  <span class="text-gray-600 font-medium">{{ item.key }}</span>
                  @if (item.val === 'OK') {
                    <span class="text-green-700 font-bold flex items-center gap-0.5">
                      <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l3-3z" clip-rule="evenodd"/></svg> Conforme
                    </span>
                  } @else {
                    <span class="text-red-700 font-bold flex items-center gap-0.5">
                      <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg> Avaria
                    </span>
                  }
                </div>
              }
            </div>
          </div>
        }

        <!-- Items Breakdown Graphic (Visual Progress Bar) -->
        <div class="border border-gray-200 rounded-lg p-4 mb-6 bg-gray-50/50">
          <h3 class="font-bold border-b border-gray-200 pb-1 mb-2.5 uppercase text-[9px] tracking-wider text-indigo-900">Distribuição Financeira (Mão de Obra vs Materiais)</h3>
          <div class="flex items-center justify-between text-[10px] font-bold text-gray-700 mb-1.5">
            <span>Serviços/Mão de Obra: {{ getServicesPercentage(activePrintWorkOrder()) }}%</span>
            <span>Peças/Materiais: {{ getPartsPercentage(activePrintWorkOrder()) }}%</span>
          </div>
          <div class="h-2 w-full bg-gray-200 rounded-full overflow-hidden flex border border-gray-300">
            <div class="bg-indigo-700 h-full" [style.width.%]="getServicesPercentage(activePrintWorkOrder())"></div>
            <div class="bg-teal-600 h-full" [style.width.%]="getPartsPercentage(activePrintWorkOrder())"></div>
          </div>
        </div>

        <!-- Services & Parts Table -->
        <div class="border border-gray-200 rounded-lg overflow-hidden mb-6">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-indigo-950 text-white uppercase text-[9px] font-bold tracking-wider">
                <th class="p-2 border-r border-indigo-800 w-16">Tipo</th>
                <th class="p-2 border-r border-indigo-800">Descrição</th>
                <th class="p-2 border-r border-indigo-800 text-center w-16">Qtd</th>
                <th class="p-2 border-r border-indigo-800 text-right w-24">Valor Unitário</th>
                <th class="p-2 text-right w-24">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <!-- Services Rows -->
              @for (s of activePrintWorkOrder().services; track $index) {
                <tr class="border-b border-gray-200 text-[10px] text-gray-800">
                  <td class="p-2 border-r border-gray-200 uppercase text-[8px] font-bold text-indigo-700 bg-indigo-50/20">Mão de Obra</td>
                  <td class="p-2 border-r border-gray-200 font-medium">{{ getServiceName(s.serviceId) }}</td>
                  <td class="p-2 border-r border-gray-200 text-center">
                    @if (showHourlyInPrint() && isServiceHourly(s.serviceId)) {
                      {{ Number(s.quantity).toFixed(1) }} h
                    } @else {
                      {{ s.quantity }}
                    }
                  </td>
                  <td class="p-2 border-r border-gray-200 text-right">
                    R$ {{ Number(s.unitPrice !== undefined ? s.unitPrice : getServicePrice(s.serviceId)).toFixed(2) }}{{ (showHourlyInPrint() && isServiceHourly(s.serviceId)) ? '/h' : '' }}
                  </td>
                  <td class="p-2 text-right font-bold text-gray-900">
                    R$ {{ (s.quantity * Number(s.unitPrice !== undefined ? s.unitPrice : getServicePrice(s.serviceId))).toFixed(2) }}
                  </td>
                </tr>
              }
              <!-- Parts Rows -->
              @for (p of activePrintWorkOrder().parts; track $index) {
                <tr class="border-b border-gray-200 text-[10px] text-gray-800">
                  <td class="p-2 border-r border-gray-200 uppercase text-[8px] font-bold text-teal-700 bg-teal-50/20">Peça</td>
                  <td class="p-2 border-r border-gray-200 font-medium">{{ getPartName(p.partId) }}</td>
                  <td class="p-2 border-r border-gray-200 text-center">{{ p.quantity }}</td>
                  <td class="p-2 border-r border-gray-200 text-right">R$ {{ Number(p.unitPrice !== undefined ? p.unitPrice : getPartPrice(p.partId)).toFixed(2) }}</td>
                  <td class="p-2 text-right font-bold text-gray-900">
                    R$ {{ (p.quantity * Number(p.unitPrice !== undefined ? p.unitPrice : getPartPrice(p.partId))).toFixed(2) }}
                  </td>
                </tr>
              }
              @if (!activePrintWorkOrder().services?.length && !activePrintWorkOrder().parts?.length) {
                <tr>
                  <td colspan="5" class="p-4 text-center text-gray-400 italic border-b border-gray-200">Sem itens adicionados a esta OS/Orçamento.</td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Total Breakdown Box -->
        <div class="flex justify-end mb-8">
          <div class="w-72 border border-gray-200 p-4 rounded-lg bg-gray-50/80">
            <div class="flex justify-between py-1 border-b border-gray-200 text-[10px]">
              <span class="text-gray-500 font-medium">Mão de Obra (Serviços):</span>
              <span class="font-bold text-gray-800">R$ {{ getServicesTotal(activePrintWorkOrder()).toFixed(2) }}</span>
            </div>
            <div class="flex justify-between py-1 border-b border-gray-200 text-[10px]">
              <span class="text-gray-500 font-medium">Peças / Materiais:</span>
              <span class="font-bold text-gray-800">R$ {{ getPartsTotal(activePrintWorkOrder()).toFixed(2) }}</span>
            </div>
            <div class="flex justify-between py-2 mt-2 border-t border-indigo-900 font-extrabold text-xs text-indigo-950">
              <span>VALOR TOTAL GERAL:</span>
              <span>R$ {{ Number(activePrintWorkOrder().totalAmount).toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <!-- Authorization Term & Signatures -->
        <div class="mt-14 pt-6 border-t border-gray-200">
          <p class="text-center text-[8px] text-gray-400 mb-12 uppercase tracking-wider font-semibold">
            Autorizo a execução dos serviços e aplicação das peças listadas acima, sob as condições comerciais acordadas.
          </p>
          <div class="flex justify-between items-center px-4">
            <div class="text-center w-64 border-t border-gray-300 pt-1.5">
              <p class="font-bold text-[10px] text-indigo-950">{{ activePrintWorkOrder().customer?.name || 'Cliente' }}</p>
              <p class="text-[8px] text-gray-400 uppercase tracking-widest mt-0.5">Assinatura do Cliente</p>
            </div>
            <div class="text-center w-64 border-t border-gray-300 pt-1.5">
              <p class="font-bold text-[10px] text-indigo-950">{{ authService.currentTenant()?.name || 'Responsável Técnico' }}</p>
              <p class="text-[8px] text-gray-400 uppercase tracking-widest mt-0.5">Responsável da Oficina</p>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class WorkOrdersComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;
  readonly authService = inject(AuthService);

  readonly workOrders = signal<any[]>([]);
  readonly filteredWorkOrders = signal<any[]>([]);

  readonly customers = signal<any[]>([]);
  readonly vehicles = signal<any[]>([]);
  readonly services = signal<any[]>([]);
  readonly parts = signal<any[]>([]);
  readonly checklists = signal<any[]>([]);

  readonly customerVehicles = signal<any[]>([]);

  searchQuery = '';

  // Toggle for hourly config in print
  readonly showHourlyInPrint = signal(true);

  // Modal State
  readonly showModal = signal(false);
  readonly isEditMode = signal(false);
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  // Print State
  readonly activePrintWorkOrder = signal<any | null>(null);

  // Trigger for calculatedTotal reactivity
  readonly formChangeTrigger = signal(0);

  formData = {
    id: '',
    customerId: '',
    vehicleId: '',
    checklistId: '',
    status: 'QUEUED',
    services: [] as SelectedService[],
    parts: [] as SelectedPart[],
  };

  readonly selectedVehicleId = signal<string>('');

  // Reactive dropdown lists
  readonly customerChecklists = computed(() => {
    const vehId = this.selectedVehicleId();
    if (!vehId) return [];
    return this.checklists().filter((c) => c.vehicleId === vehId);
  });

  // Dinamic Total Aggregate in Frontend
  readonly calculatedTotal = computed(() => {
    this.formChangeTrigger(); // Register reactive dependency
    let sum = 0;

    this.formData.services.forEach((s) => {
      if (!s.serviceId) return;
      const sDb = this.services().find((item) => item.id === s.serviceId);
      if (sDb) {
        sum += (s.quantity || 1) * Number(sDb.basePrice);
      }
    });

    this.formData.parts.forEach((p) => {
      if (!p.partId) return;
      const pDb = this.parts().find((item) => item.id === p.partId);
      if (pDb) {
        sum += (p.quantity || 1) * Number(pDb.price);
      }
    });

    return sum;
  });

  protected readonly Number = Number;

  ngOnInit(): void {
    this.loadWorkOrders();
    this.loadCatalogs();
  }

  loadWorkOrders(): void {
    this.http.get<any[]>(`${this.apiUrl}/work-orders`).subscribe({
      next: (data) => {
        this.workOrders.set(data);
        this.filterWorkOrders();
      },
      error: (err) => console.error('Erro ao listar OSs', err),
    });
  }

  loadCatalogs(): void {
    forkJoin({
      customers: this.http.get<any[]>(`${this.apiUrl}/customers`),
      vehicles: this.http.get<any[]>(`${this.apiUrl}/vehicles`),
      services: this.http.get<any[]>(`${this.apiUrl}/services`),
      parts: this.http.get<any[]>(`${this.apiUrl}/parts`),
      checklists: this.http.get<any[]>(`${this.apiUrl}/checklists`),
    }).subscribe({
      next: (res) => {
        this.customers.set(res.customers);
        this.vehicles.set(res.vehicles);
        this.services.set(res.services);
        this.parts.set(res.parts);
        this.checklists.set(res.checklists);
      },
      error: (err) => console.error('Erro ao carregar catálogos', err),
    });
  }

  filterWorkOrders(): void {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) {
      this.filteredWorkOrders.set(this.workOrders());
      return;
    }

    const filtered = this.workOrders().filter(
      (wo) =>
        wo.vehicle?.plate.toLowerCase().includes(query) ||
        wo.customer?.name.toLowerCase().includes(query)
    );
    this.filteredWorkOrders.set(filtered);
  }

  onCustomerChange(): void {
    const custId = this.formData.customerId;
    const filtered = this.vehicles().filter((v) => v.customerId === custId);
    this.customerVehicles.set(filtered);

    // Reseta veículo se não pertencer ao novo cliente
    if (this.formData.vehicleId && !filtered.some((v) => v.id === this.formData.vehicleId)) {
      this.formData.vehicleId = '';
    }
    this.selectedVehicleId.set(this.formData.vehicleId);
    
    // Reseta checklist se veículo resetar ou se o novo checklist não for compatível
    this.formData.checklistId = '';
  }

  onVehicleChange(vehId: string): void {
    this.selectedVehicleId.set(vehId);
    this.formData.checklistId = '';
  }

  openModal(wo?: any): void {
    if (wo) {
      this.isEditMode.set(true);

      // Carregar os veículos do cliente da OS selecionada
      const filtered = this.vehicles().filter((v) => v.customerId === wo.customerId);
      this.customerVehicles.set(filtered);

      this.formData = {
        id: wo.id,
        customerId: wo.customerId,
        vehicleId: wo.vehicleId,
        checklistId: wo.checklistId || '',
        status: wo.status,
        services: wo.services.map((s: any) => ({
          serviceId: s.serviceId,
          quantity: s.quantity,
        })),
        parts: wo.parts.map((p: any) => ({
          partId: p.partId,
          quantity: p.quantity,
        })),
      };
      this.selectedVehicleId.set(wo.vehicleId);
    } else {
      this.isEditMode.set(false);
      this.customerVehicles.set([]);
      this.formData = {
        id: '',
        customerId: '',
        vehicleId: '',
        checklistId: '',
        status: 'QUEUED',
        services: [],
        parts: [],
      };
      this.selectedVehicleId.set('');
    }
    this.errorMessage.set(null);
    this.showModal.set(true);
    this.triggerRecalculation();
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  addService(): void {
    this.formData.services.push({ serviceId: '', quantity: 1 });
    this.triggerRecalculation();
  }

  removeService(index: number): void {
    this.formData.services.splice(index, 1);
    this.triggerRecalculation();
  }

  addPart(): void {
    this.formData.parts.push({ partId: '', quantity: 1 });
    this.triggerRecalculation();
  }

  removePart(index: number): void {
    this.formData.parts.splice(index, 1);
    this.triggerRecalculation();
  }

  saveWorkOrder(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    const payload = {
      customerId: this.formData.customerId,
      vehicleId: this.formData.vehicleId,
      checklistId: this.formData.checklistId || null,
      status: this.formData.status,
      services: this.formData.services,
      parts: this.formData.parts,
    };

    const request$ = this.isEditMode()
      ? this.http.patch(`${this.apiUrl}/work-orders/${this.formData.id}`, payload)
      : this.http.post(`${this.apiUrl}/work-orders`, payload);

    request$.subscribe({
      next: () => {
        this.loading.set(false);
        this.closeModal();
        this.loadWorkOrders();
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err?.error?.message || 'Falha ao salvar Ordem de Serviço.');
      },
    });
  }

  deleteWorkOrder(id: string): void {
    if (!confirm('Deseja realmente excluir esta Ordem de Serviço?')) return;

    this.http.delete(`${this.apiUrl}/work-orders/${id}`).subscribe({
      next: () => this.loadWorkOrders(),
      error: (err) => console.error('Erro ao excluir OS', err),
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

  vehLabel(vehicle: any): string {
    if (!vehicle) return '-';
    return `${vehicle.brand} ${vehicle.model}`;
  }

  triggerRecalculation(): void {
    this.formChangeTrigger.update(v => v + 1);
  }

  getServiceName(serviceId: string): string {
    const s = this.services().find(item => item.id === serviceId);
    return s ? s.name : 'Serviço';
  }

  getServicePrice(serviceId: string): number {
    const s = this.services().find(item => item.id === serviceId);
    return s ? Number(s.basePrice) : 0;
  }

  getPartName(partId: string): string {
    const p = this.parts().find(item => item.id === partId);
    return p ? p.name : 'Peça';
  }

  getPartPrice(partId: string): number {
    const p = this.parts().find(item => item.id === partId);
    return p ? Number(p.price) : 0;
  }

  isServiceHourly(serviceId: string): boolean {
    const s = this.services().find(item => item.id === serviceId);
    return s ? !!s.isHourly : false;
  }

  getServicesTotal(wo: any): number {
    if (!wo || !wo.services) return 0;
    return wo.services.reduce((sum: number, s: any) => {
      const price = s.unitPrice !== undefined ? Number(s.unitPrice) : this.getServicePrice(s.serviceId);
      return sum + (s.quantity * price);
    }, 0);
  }

  getPartsTotal(wo: any): number {
    if (!wo || !wo.parts) return 0;
    return wo.parts.reduce((sum: number, p: any) => {
      const price = p.unitPrice !== undefined ? Number(p.unitPrice) : this.getPartPrice(p.partId);
      return sum + (p.quantity * price);
    }, 0);
  }

  getServicesPercentage(wo: any): number {
    const sTotal = this.getServicesTotal(wo);
    const pTotal = this.getPartsTotal(wo);
    const total = sTotal + pTotal;
    if (total === 0) return 0;
    return Math.round((sTotal / total) * 100);
  }

  getPartsPercentage(wo: any): number {
    const sTotal = this.getServicesTotal(wo);
    const pTotal = this.getPartsTotal(wo);
    const total = sTotal + pTotal;
    if (total === 0) return 0;
    return Math.round((pTotal / total) * 100);
  }

  isBudget(wo: any): boolean {
    return wo && (wo.status === 'ESTIMATING' || wo.status === 'QUEUED');
  }

  getFuelLevelLabel(level: string): string {
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

  printWorkOrder(wo: any): void {
    this.activePrintWorkOrder.set(wo);
    setTimeout(() => {
      window.print();
      this.activePrintWorkOrder.set(null);
    }, 250);
  }
}
