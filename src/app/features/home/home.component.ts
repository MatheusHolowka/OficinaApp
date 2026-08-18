import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-hidden selection:bg-purple-500 selection:text-white">
      <!-- Grid Overlay Background -->
      <div class="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none"></div>

      <!-- Moving Light Auroras -->
      <div class="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-gradient-to-tr from-purple-600/20 to-fuchsia-600/0 rounded-full blur-[120px] pointer-events-none animate-[pulse_10s_infinite]"></div>
      <div class="absolute top-[30%] right-[-10%] w-[45vw] h-[45vw] bg-gradient-to-br from-blue-600/10 to-teal-500/0 rounded-full blur-[120px] pointer-events-none animate-[pulse_8s_infinite_1s]"></div>
      <div class="absolute bottom-[-10%] left-[20%] w-[55vw] h-[55vw] bg-gradient-to-tr from-indigo-700/10 to-purple-600/0 rounded-full blur-[140px] pointer-events-none"></div>

      <!-- Navigation Header -->
      <header class="sticky top-0 z-50 bg-slate-950/60 backdrop-blur-xl border-b border-slate-900/60 px-6 py-4 transition-all">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center font-black text-white shadow-xl shadow-purple-500/20 tracking-tighter">
              O
            </div>
            <div>
              <span class="text-xl font-black tracking-tight text-white bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text">OficinaFlow</span>
              <span class="text-[9px] text-purple-400 block -mt-1 font-bold uppercase tracking-widest">SaaS de Oficina</span>
            </div>
          </div>

          <!-- Navigation Links -->
          <nav class="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-400">
            <a href="#recursos" (click)="scrollToSection('recursos', $event)" class="hover:text-purple-400 transition-colors relative py-1 group">
              Recursos
              <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-500 transition-all group-hover:w-full"></span>
            </a>
            <a href="#como-funciona" (click)="scrollToSection('como-funciona', $event)" class="hover:text-purple-400 transition-colors relative py-1 group">
              Como Funciona
              <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-500 transition-all group-hover:w-full"></span>
            </a>
            <a href="#precos" (click)="scrollToSection('precos', $event)" class="hover:text-purple-400 transition-colors relative py-1 group">
              Planos & Preços
              <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-500 transition-all group-hover:w-full"></span>
            </a>
            <a href="#faq" (click)="scrollToSection('faq', $event)" class="hover:text-purple-400 transition-colors relative py-1 group">
              Dúvidas
              <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-500 transition-all group-hover:w-full"></span>
            </a>
          </nav>

          <!-- CTAs -->
          <div class="flex items-center gap-4">
            @if (authService.isAuthenticated()) {
              <a
                routerLink="/dashboard"
                class="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white font-bold rounded-xl shadow-lg shadow-purple-500/20 transition-all hover:scale-[1.03] active:scale-[0.97] text-sm flex items-center gap-2"
              >
                <span>Ir para o Painel</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
            } @else {
              <a
                routerLink="/login"
                class="text-sm font-bold text-slate-300 hover:text-white transition px-4 py-2"
              >
                Entrar
              </a>
              <a
                routerLink="/register"
                class="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-sm font-bold text-white hover:border-slate-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Criar Conta
              </a>
            }
          </div>
        </div>
      </header>

      <!-- Hero Section -->
      <section class="max-w-7xl mx-auto px-6 pt-24 pb-20 text-center relative z-10">
        <!-- Floating Badge -->
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider mb-8 shadow-xl backdrop-blur-md">
          <span class="w-2 h-2 rounded-full bg-purple-500 animate-ping"></span>
          <span>Checklist Digital com Fotos e Sem Burocracia</span>
        </div>

        <h1 class="text-5xl md:text-7xl font-black text-white tracking-tight leading-[1.1] max-w-5xl mx-auto">
          Gerencie sua Oficina Mecânica <br>
          <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-blue-400 bg-clip-text text-transparent">
            No Ritmo do Futuro
          </span>
        </h1>

        <p class="text-slate-400 text-lg md:text-xl mt-8 max-w-3xl mx-auto leading-relaxed font-medium">
          Diga adeus ao papel, às pranchetas sujas de graxa e às fotos perdidas no WhatsApp. O OficinaFlow centraliza vistorias interativas, orçamentos rápidos e o acompanhamento de Ordens de Serviço.
        </p>

        <div class="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <a
            routerLink="/register"
            [queryParams]="{ plan: 'PRATA' }"
            class="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white font-bold rounded-xl shadow-xl shadow-purple-500/20 hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 text-base"
          >
            Começar Grátis (Plano Prata)
          </a>
          <a
            href="#recursos"
            (click)="scrollToSection('recursos', $event)"
            class="w-full sm:w-auto px-8 py-4 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-xl font-bold text-slate-300 hover:text-white transition-all duration-200"
          >
            Conhecer Recursos
          </a>
        </div>

        <!-- Dynamic Workspace Showcase -->
        <div class="mt-20 relative mx-auto max-w-5xl rounded-3xl border border-slate-800/80 bg-slate-900/20 p-6 backdrop-blur-2xl shadow-3xl overflow-hidden group">
          <div class="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

          <!-- Showcase Navigation Header -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800/60 mb-6 gap-4">
            <div class="flex items-center gap-2">
              <span class="w-3.5 h-3.5 rounded-full bg-red-500/60"></span>
              <span class="w-3.5 h-3.5 rounded-full bg-yellow-500/60"></span>
              <span class="w-3.5 h-3.5 rounded-full bg-green-500/60"></span>
              <span class="text-xs font-semibold text-slate-500 ml-2 font-mono bg-slate-950 px-3 py-1 rounded-full border border-slate-900">oficinaflow.tech/painel/workspace</span>
            </div>
            
            <!-- Showcase Switch Tabs -->
            <div class="flex bg-slate-950 p-1 rounded-xl border border-slate-850 self-start sm:self-auto">
              <button 
                (click)="activeMockupTab.set('checklist')"
                [class]="'px-4 py-2 text-xs font-bold rounded-lg transition-all ' + (activeMockupTab() === 'checklist' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white')"
              >
                Checklist Digital
              </button>
              <button 
                (click)="activeMockupTab.set('finance')"
                [class]="'px-4 py-2 text-xs font-bold rounded-lg transition-all ' + (activeMockupTab() === 'finance' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white')"
              >
                Faturamento
              </button>
              <button 
                (click)="activeMockupTab.set('flow')"
                [class]="'px-4 py-2 text-xs font-bold rounded-lg transition-all ' + (activeMockupTab() === 'flow' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white')"
              >
                Status de OS
              </button>
            </div>
          </div>

          <!-- Active Workspace Contents -->
          <div class="min-h-[280px]">
            <!-- Tab: Checklist Digital -->
            @if (activeMockupTab() === 'checklist') {
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-left animate-fadeIn">
                <div class="p-6 bg-slate-950/80 border border-slate-850 rounded-2xl flex flex-col justify-between">
                  <div>
                    <div class="flex justify-between items-start mb-4">
                      <div>
                        <span class="text-[10px] text-purple-400 uppercase tracking-widest font-black">VISTORIA RÁPIDA</span>
                        <h4 class="text-base font-extrabold text-white mt-1">Porsche 911 Carrera</h4>
                      </div>
                      <span class="px-2 py-1 rounded bg-purple-500/10 border border-purple-500/20 text-[10px] font-bold text-purple-400 uppercase">Placa: PSH-9111</span>
                    </div>

                    <div class="space-y-3.5 my-6">
                      <div class="flex justify-between items-center text-xs">
                        <span class="text-slate-400 font-medium">Nível de Combustível</span>
                        <span class="text-slate-200 font-bold">3/4 Tanque</span>
                      </div>
                      <div class="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                        <div class="bg-gradient-to-r from-purple-500 to-blue-500 h-full w-[75%]"></div>
                      </div>

                      <div class="flex justify-between items-center text-xs pt-2">
                        <span class="text-slate-400 font-medium">Quilometragem Registrada</span>
                        <span class="text-slate-200 font-bold font-mono">12.450 km</span>
                      </div>
                    </div>
                  </div>

                  <div class="flex gap-2">
                    <span class="px-2.5 py-1 rounded bg-green-500/10 border border-green-500/20 text-[9px] font-extrabold text-green-400 uppercase tracking-wider">✔ Rodas OK</span>
                    <span class="px-2.5 py-1 rounded bg-green-500/10 border border-green-500/20 text-[9px] font-extrabold text-green-400 uppercase tracking-wider">✔ Faróis OK</span>
                    <span class="px-2.5 py-1 rounded bg-red-500/10 border border-red-500/20 text-[9px] font-extrabold text-red-400 uppercase tracking-wider">❌ Parachoque Riscado</span>
                  </div>
                </div>

                <div class="p-6 bg-slate-950/80 border border-slate-850 rounded-2xl flex flex-col justify-between">
                  <div>
                    <h4 class="text-sm font-extrabold text-white mb-2">Avarias Registradas (Fotos)</h4>
                    <p class="text-slate-400 text-xs">Fotos enviadas pelo mecânico direto do tablet ou celular na entrada do veículo.</p>
                    
                    <div class="grid grid-cols-2 gap-3 mt-4">
                      <div class="aspect-video rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center relative overflow-hidden group/img">
                        <div class="absolute inset-0 bg-red-500/10 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 text-red-400">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                          </svg>
                        </div>
                        <span class="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 text-[8px] font-bold text-red-400 uppercase">Avaria #1 (Parachoque)</span>
                      </div>
                      <div class="aspect-video rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center relative overflow-hidden">
                        <div class="absolute inset-0 bg-slate-800 flex items-center justify-center text-slate-500 text-xs">
                          <span class="font-medium">Nenhuma avaria</span>
                        </div>
                        <span class="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 text-[8px] font-bold text-slate-400 uppercase">Traseira</span>
                      </div>
                    </div>
                  </div>

                  <div class="text-xs text-slate-400 flex items-center gap-2 border-t border-slate-900 pt-4 mt-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4.5 h-4.5 text-purple-400">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                    <span>Vistoria salva com data, hora e assinatura digital do cliente.</span>
                  </div>
                </div>
              </div>
            }

            <!-- Tab: Faturamento -->
            @if (activeMockupTab() === 'finance') {
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-left animate-fadeIn">
                <div class="p-6 bg-slate-950/80 border border-slate-850 rounded-2xl">
                  <span class="text-[9px] text-green-400 uppercase font-black tracking-widest">FATURAMENTO ESTE MÊS</span>
                  <p class="text-3xl font-extrabold text-white mt-2 font-mono">R$ 28.450,00</p>
                  <span class="text-xs text-green-400 font-bold mt-1 inline-flex items-center gap-1">
                    <svg class="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"/></svg>
                    +15% em relação ao mês anterior
                  </span>
                </div>

                <div class="p-6 bg-slate-950/80 border border-slate-850 rounded-2xl">
                  <span class="text-[9px] text-blue-400 uppercase font-black tracking-widest">TICKET MÉDIO DA OFICINA</span>
                  <p class="text-3xl font-extrabold text-white mt-2 font-mono">R$ 1.890,00</p>
                  <span class="text-xs text-slate-400 mt-1 block">Otimizado por venda de serviços adicionais</span>
                </div>

                <div class="p-6 bg-slate-950/80 border border-slate-850 rounded-2xl">
                  <span class="text-[9px] text-purple-400 uppercase font-black tracking-widest">METAS MENSAIS DE FATURAMENTO</span>
                  <div class="flex items-center justify-between text-xs font-bold text-slate-200 mt-3 mb-1">
                    <span>Atingido: 84%</span>
                    <span>Meta: R$ 32.000</span>
                  </div>
                  <div class="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div class="bg-gradient-to-r from-purple-500 to-green-500 h-full w-[84%]"></div>
                  </div>
                </div>
              </div>
            }

            <!-- Tab: Status de OS -->
            @if (activeMockupTab() === 'flow') {
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-left animate-fadeIn">
                <!-- Column 1: Fila -->
                <div class="p-4 bg-slate-950/80 border border-slate-900 rounded-xl">
                  <span class="text-[9px] font-black uppercase text-slate-500 tracking-wider">Na Fila (1)</span>
                  <div class="p-3 bg-slate-900/60 border border-slate-850 rounded-lg mt-3">
                    <h5 class="text-xs font-bold text-white">Troca de Amortecedores</h5>
                    <p class="text-[10px] text-slate-400 mt-1">Toyota Corolla - HJZ-4433</p>
                    <span class="inline-block px-1.5 py-0.5 rounded text-[8px] bg-slate-800 text-slate-400 mt-2.5 font-bold uppercase">Aguardando Início</span>
                  </div>
                </div>

                <!-- Column 2: Orçamento -->
                <div class="p-4 bg-slate-950/80 border border-slate-900 rounded-xl">
                  <span class="text-[9px] font-black uppercase text-yellow-500 tracking-wider">Orçamento (1)</span>
                  <div class="p-3 bg-slate-900/60 border border-yellow-950/20 border-yellow-800/20 rounded-lg mt-3">
                    <h5 class="text-xs font-bold text-white">Revisão Geral & Pastilhas</h5>
                    <p class="text-[10px] text-slate-400 mt-1">Honda Civic - KLA-9898</p>
                    <span class="inline-block px-1.5 py-0.5 rounded text-[8px] bg-yellow-950 text-yellow-400 mt-2.5 font-bold uppercase">Aguardando Assinatura</span>
                  </div>
                </div>

                <!-- Column 3: Executando -->
                <div class="p-4 bg-slate-950/80 border border-slate-900 rounded-xl">
                  <span class="text-[9px] font-black uppercase text-purple-400 tracking-wider">Executando (1)</span>
                  <div class="p-3 bg-slate-900/60 border border-purple-950/20 border-purple-800/20 rounded-lg mt-3">
                    <h5 class="text-xs font-bold text-white">Alinhamento & Balanceamento</h5>
                    <p class="text-[10px] text-slate-400 mt-1">Chevrolet Cruze - GDF-1122</p>
                    <span class="inline-block px-1.5 py-0.5 rounded text-[8px] bg-purple-950 text-purple-400 mt-2.5 font-bold uppercase">No Elevador</span>
                  </div>
                </div>

                <!-- Column 4: Concluído -->
                <div class="p-4 bg-slate-950/80 border border-slate-900 rounded-xl">
                  <span class="text-[9px] font-black uppercase text-green-400 tracking-wider">Concluído (1)</span>
                  <div class="p-3 bg-slate-900/60 border border-green-950/20 border-green-800/20 rounded-lg mt-3">
                    <h5 class="text-xs font-bold text-white">Troca de Óleo e Filtros</h5>
                    <p class="text-[10px] text-slate-400 mt-1">Fiat Argo - MKK-4545</p>
                    <span class="inline-block px-1.5 py-0.5 rounded text-[8px] bg-green-950 text-green-400 mt-2.5 font-bold uppercase">Pronto para Retirada</span>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- Bento Grid Features Section -->
      <section id="recursos" class="max-w-7xl mx-auto px-6 py-28 border-t border-slate-900/60 relative z-10 scroll-mt-20">
        <div class="text-center mb-20">
          <span class="text-xs text-purple-400 font-bold uppercase tracking-widest bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">RECURSOS PREMIUM</span>
          <h2 class="text-4xl font-extrabold text-white mt-4 tracking-tight">A Central de Comando da Sua Oficina</h2>
          <p class="text-slate-400 text-base mt-4 max-w-2xl mx-auto">
            Substitua planilhas estáticas e blocos de papel por uma suíte completa de ferramentas desenhadas para o fluxo mecânico real.
          </p>
        </div>

        <!-- Bento Grid Layout -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px] md:auto-rows-[200px]">
          
          <!-- Box 1 (Checklists - Double height & width) -->
          <div class="md:col-span-2 md:row-span-2 p-8 rounded-3xl bg-slate-900/10 border border-slate-900 hover:border-purple-500/40 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/5 group flex flex-col justify-between overflow-hidden relative">
            <div class="absolute -right-16 -top-16 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-600/10 transition-colors"></div>
            <div>
              <div class="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-white tracking-tight">Checklists Digitais Avançados</h3>
              <p class="text-slate-400 text-sm mt-3 leading-relaxed max-w-lg">
                Realize a vistoria de entrada dos veículos e configure medições precisas. Registre o nível de combustível atual, a quilometragem exata e envie fotos de avarias para evitar reclamações posteriores sobre riscos ou amassados.
              </p>
            </div>
            <div class="flex items-center gap-4 text-xs font-bold text-slate-500 border-t border-slate-900/60 pt-4 mt-4">
              <span>🚀 100% Mobile Ready</span>
              <span>•</span>
              <span>📸 Anexos Ilimitados de Fotos</span>
            </div>
          </div>

          <!-- Box 2 (Multitenant - Single box) -->
          <div class="p-6 rounded-3xl bg-slate-900/10 border border-slate-900 hover:border-blue-500/30 transition-all duration-500 flex flex-col justify-between">
            <div class="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-5.5 h-5.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <div>
              <h4 class="text-lg font-bold text-white">Isolamento Multi-tenant</h4>
              <p class="text-slate-400 text-xs mt-2 leading-relaxed">
                Dados blindados. Cada oficina possui sua área privada com seu próprio slug/subdomínio exclusivo de acesso.
              </p>
            </div>
          </div>

          <!-- Box 3 (Multiusers - Single box) -->
          <div class="p-6 rounded-3xl bg-slate-900/10 border border-slate-900 hover:border-fuchsia-500/30 transition-all duration-500 flex flex-col justify-between">
            <div class="w-10 h-10 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-5.5 h-5.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A11.386 11.386 0 0110.089 20M3 11.627a1.131 1.131 0 01.37-1.07l.086-.067a11.963 11.963 0 0113.77-.008c.078.054.146.12.2.19l.245.335a1.147 1.147 0 01-.068 1.487l-4.57 4.154A11.07 11.07 0 0110 20v-3.872" />
              </svg>
            </div>
            <div>
              <h4 class="text-lg font-bold text-white">Equipe Multiusuário</h4>
              <p class="text-slate-400 text-xs mt-2 leading-relaxed">
                Defina papéis específicos (ADMIN, RECEPCIONISTA, MECÂNICO) para restringir o acesso apenas aos recursos permitidos.
              </p>
            </div>
          </div>

          <!-- Box 4 (Peças e Serviços - Single box) -->
          <div class="p-6 rounded-3xl bg-slate-900/10 border border-slate-900 hover:border-teal-500/30 transition-all duration-500 flex flex-col justify-between">
            <div class="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-5.5 h-5.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17L17.25 21A2.67 2.67 0 0021 17.25l-5.83-5.83M11.42 15.17l-3.76-.096a.75.75 0 01-.652-.652L7 10.67M11.42 15.17L9.5 17.1" />
              </svg>
            </div>
            <div>
              <h4 class="text-lg font-bold text-white">Estoque & Serviços</h4>
              <p class="text-slate-400 text-xs mt-2 leading-relaxed">
                Gerencie catálogo de peças com preços e códigos. Adicione serviços com valores por hora ou preço fixo.
              </p>
            </div>
          </div>

          <!-- Box 5 (OS Dinâmica - Double width) -->
          <div class="md:col-span-2 p-8 rounded-3xl bg-slate-900/10 border border-slate-900 hover:border-amber-500/30 transition-all duration-500 flex flex-col justify-between relative overflow-hidden group">
            <div class="absolute -right-16 -top-16 w-48 h-48 bg-amber-600/5 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-600/10 transition-colors"></div>
            <div>
              <div class="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-5.5 h-5.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5" />
                </svg>
              </div>
              <h4 class="text-lg font-bold text-white">Ordens de Serviço Integradas</h4>
              <p class="text-slate-400 text-sm mt-2 leading-relaxed">
                Conecte a Ordem de Serviço à vistoria realizada. O sistema calcula a distribuição financeira automaticamente, dividindo receita de mão de obra de materiais e peças com transparência absoluta.
              </p>
            </div>
            <div class="text-[10px] text-slate-500 mt-4 font-bold uppercase tracking-wider">
              📊 Distribuição Automática de Receita (Serviço vs Peça)
            </div>
          </div>
        </div>
      </section>

      <!-- How it Works Flow Map -->
      <section id="como-funciona" class="py-28 border-t border-slate-900/60 relative z-10 scroll-mt-20 bg-slate-900/10">
        <div class="max-w-7xl mx-auto px-6">
          <div class="text-center mb-20">
            <span class="text-xs text-blue-400 font-bold uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">FLUXO DO SOFTWARE</span>
            <h2 class="text-4xl font-extrabold text-white mt-4 tracking-tight">O Caminho do Veículo sem Papel</h2>
            <p class="text-slate-400 text-base mt-4 max-w-2xl mx-auto">
              Veja como o OficinaFlow transforma e acelera a rotina da sua recepção até o pátio de manutenção.
            </p>
          </div>

          <!-- Flow Steps layout -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <!-- Dotted connector lines -->
            <div class="hidden md:block absolute top-[50px] left-[20%] right-[20%] h-[2px] bg-gradient-to-r from-purple-500/40 via-blue-500/40 to-teal-500/40 z-0"></div>

            <!-- Step 1 -->
            <div class="text-center relative z-10 group">
              <div class="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 text-purple-400 font-black text-xl flex items-center justify-center mx-auto mb-6 group-hover:border-purple-500/60 group-hover:shadow-lg group-hover:shadow-purple-500/10 transition-all duration-300">
                01
              </div>
              <h3 class="text-lg font-bold text-white">Vistoria e Checklist</h3>
              <p class="text-slate-400 text-sm mt-3 px-4 leading-relaxed font-medium">
                O veículo chega na oficina. O recepcionista registra dados básicos de entrada, anexa as fotos de avarias pelo celular e o cliente assina digitalmente.
              </p>
            </div>

            <!-- Step 2 -->
            <div class="text-center relative z-10 group">
              <div class="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 text-blue-400 font-black text-xl flex items-center justify-center mx-auto mb-6 group-hover:border-blue-500/60 group-hover:shadow-lg group-hover:shadow-blue-500/10 transition-all duration-300">
                02
              </div>
              <h3 class="text-lg font-bold text-white">Abertura de OS & Peças</h3>
              <p class="text-slate-400 text-sm mt-3 px-4 leading-relaxed font-medium">
                Vincule o checklist criado a uma Ordem de Serviço active. Insira as peças necessárias retiradas do estoque e defina a mão de obra pelo valor da hora de serviço.
              </p>
            </div>

            <!-- Step 3 -->
            <div class="text-center relative z-10 group">
              <div class="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 text-teal-400 font-black text-xl flex items-center justify-center mx-auto mb-6 group-hover:border-teal-500/60 group-hover:shadow-lg group-hover:shadow-teal-500/10 transition-all duration-300">
                03
              </div>
              <h3 class="text-lg font-bold text-white">Impressão & Entrega</h3>
              <p class="text-slate-400 text-sm mt-3 px-4 leading-relaxed font-medium">
                Gere o orçamento profissional e imprima em formato A4 perfeito de página única (100% de largura) para o fechamento e entrega segura do veículo.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Pricing Plans with Dynamic Calculator -->
      <section id="precos" class="max-w-7xl mx-auto px-6 py-28 border-t border-slate-900/60 relative z-10 scroll-mt-20">
        <div class="text-center mb-16">
          <span class="text-xs text-purple-400 font-bold uppercase tracking-widest bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">PREÇO CLARO</span>
          <h2 class="text-4xl font-extrabold text-white mt-4 tracking-tight">Escolha o Tamanho da Sua Operação</h2>
          <p class="text-slate-400 text-base mt-4">Nossos planos escalam de acordo com as necessidades e usuários de sua equipe.</p>

          <!-- Interactive Plan Toggle -->
          <div class="flex items-center justify-center gap-2 mt-10 bg-slate-950 p-1.5 rounded-2xl border border-slate-900 w-fit mx-auto">
            <button 
              (click)="selectedTier.set('bronze')"
              [class]="'px-6 py-2.5 text-xs font-extrabold rounded-xl transition-all ' + (selectedTier() === 'bronze' ? 'bg-slate-900 text-white border border-slate-800 shadow-md' : 'text-slate-400 hover:text-white')"
            >
              Bronze (Autônomo)
            </button>
            <button 
              (click)="selectedTier.set('prata')"
              [class]="'px-6 py-2.5 text-xs font-extrabold rounded-xl transition-all ' + (selectedTier() === 'prata' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white')"
            >
              Prata (Recomendado)
            </button>
            <button 
              (click)="selectedTier.set('ouro')"
              [class]="'px-6 py-2.5 text-xs font-extrabold rounded-xl transition-all ' + (selectedTier() === 'ouro' ? 'bg-slate-900 text-white border border-slate-800 shadow-md' : 'text-slate-400 hover:text-white')"
            >
              Ouro (Centro Automotivo)
            </button>
          </div>
        </div>

        <!-- Selected Plan Box Container -->
        <div class="max-w-2xl mx-auto animate-fadeIn">
          <!-- Bronze Tier Box -->
          @if (selectedTier() === 'bronze') {
            <div class="p-8 rounded-3xl bg-slate-900/20 border border-slate-800 flex flex-col justify-between relative shadow-2xl">
              <div>
                <div class="flex justify-between items-start">
                  <div>
                    <span class="text-slate-400 text-xs font-extrabold uppercase tracking-widest">PLANO BRONZE</span>
                    <h3 class="text-2xl font-black text-white mt-1">Essencial Digital</h3>
                  </div>
                  <div class="text-right">
                    <span class="text-4xl font-black text-white font-mono">R$ 99</span>
                    <span class="text-slate-500 text-xs block">/mês</span>
                  </div>
                </div>
                <p class="text-slate-400 text-sm mt-4 leading-relaxed">
                  Ideal para profissionais independentes que operam sozinhos e precisam organizar ordens de serviço e cadastros sem complicações.
                </p>
                
                <ul class="mt-8 space-y-4 text-sm text-slate-300 border-t border-slate-900 pt-8">
                  <li class="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5 text-purple-400">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span>1 Usuário Ativo (Administrador)</span>
                  </li>
                  <li class="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5 text-purple-400">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span>Clientes, Veículos & OS Ilimitados</span>
                  </li>
                  <li class="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5 text-purple-400">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span>Checklist Básico (combustível, quilometragem)</span>
                  </li>
                  <li class="flex items-center gap-3 opacity-40">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5 text-slate-500">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span class="line-through">Sem anexo de fotos de avarias</span>
                  </li>
                </ul>
              </div>

              <a
                routerLink="/register"
                [queryParams]="{ plan: 'BRONZE' }"
                class="w-full mt-10 py-4 px-6 bg-slate-950 hover:bg-slate-900 text-white font-bold rounded-xl text-center border border-slate-800 transition-all hover:scale-[1.02]"
              >
                Assinar Plano Bronze
              </a>
            </div>
          }

          <!-- Prata Tier Box -->
          @if (selectedTier() === 'prata') {
            <div class="p-8 rounded-3xl bg-gradient-to-b from-slate-900/30 to-purple-950/10 border-2 border-purple-500 flex flex-col justify-between relative shadow-3xl">
              <div class="absolute -top-3.5 right-8 px-4 py-1 rounded-full bg-purple-500 text-white text-[10px] font-black uppercase tracking-wider">
                Mais Assinado
              </div>

              <div>
                <div class="flex justify-between items-start">
                  <div>
                    <span class="text-purple-400 text-xs font-extrabold uppercase tracking-widest">PLANO PRATA</span>
                    <h3 class="text-2xl font-black text-white mt-1">Profissional</h3>
                  </div>
                  <div class="text-right">
                    <span class="text-4xl font-black text-white font-mono">R$ 199</span>
                    <span class="text-slate-500 text-xs block">/mês</span>
                  </div>
                </div>
                <p class="text-slate-400 text-sm mt-4 leading-relaxed">
                  Perfeito para oficinas mecânicas em crescimento que contam com recepcionistas e mecânicos no pátio e necessitam de vistorias com fotos de avarias.
                </p>
                
                <ul class="mt-8 space-y-4 text-sm text-slate-200 border-t border-slate-900 pt-8">
                  <li class="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5 text-purple-400">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span><strong>Até 5 Usuários</strong> Simultâneos</span>
                  </li>
                  <li class="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5 text-purple-400">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span>Clientes, Veículos & OS Ilimitados</span>
                  </li>
                  <li class="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5 text-purple-400">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span>Checklist Digital Completo <strong>com Fotos de Avarias</strong></span>
                  </li>
                  <li class="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5 text-purple-400">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span>Estoque de Peças e Serviços Integrado</span>
                  </li>
                </ul>
              </div>

              <a
                routerLink="/register"
                [queryParams]="{ plan: 'PRATA' }"
                class="w-full mt-10 py-4 px-6 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white font-bold rounded-xl text-center shadow-lg shadow-purple-500/20 transition-all hover:scale-[1.02]"
              >
                Assinar Plano Prata
              </a>
            </div>
          }

          <!-- Ouro Tier Box -->
          @if (selectedTier() === 'ouro') {
            <div class="p-8 rounded-3xl bg-slate-900/20 border border-slate-800 flex flex-col justify-between relative shadow-2xl">
              <div>
                <div class="flex justify-between items-start">
                  <div>
                    <span class="text-yellow-500 text-xs font-extrabold uppercase tracking-widest">PLANO OURO</span>
                    <h3 class="text-2xl font-black text-white mt-1">Centro Automotivo</h3>
                  </div>
                  <div class="text-right">
                    <span class="text-4xl font-black text-white font-mono">R$ 299</span>
                    <span class="text-slate-500 text-xs block">/mês</span>
                  </div>
                </div>
                <p class="text-slate-400 text-sm mt-4 leading-relaxed">
                  Para redes de oficinas e grandes centros automotivos com alto volume de movimentação e demanda de usuários e suporte dedicados.
                </p>
                
                <ul class="mt-8 space-y-4 text-sm text-slate-300 border-t border-slate-900 pt-8">
                  <li class="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5 text-purple-400">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span><strong>Usuários Ilimitados</strong> (Equipe Completa)</span>
                  </li>
                  <li class="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5 text-purple-400">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span>Tudo do Plano Prata + Relatórios de Desempenho</span>
                  </li>
                  <li class="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5 text-purple-400">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span>Armazenamento em Nuvem Ampliado para Fotos</span>
                  </li>
                  <li class="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5 text-purple-400">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span>Suporte Prioritário Via WhatsApp</span>
                  </li>
                </ul>
              </div>

              <a
                routerLink="/register"
                [queryParams]="{ plan: 'OURO' }"
                class="w-full mt-10 py-4 px-6 bg-slate-950 hover:bg-slate-900 text-white font-bold rounded-xl text-center border border-slate-800 transition-all hover:scale-[1.02]"
              >
                Assinar Plano Ouro
              </a>
            </div>
          }
        </div>
      </section>

      <!-- Modern Accordion FAQ Section -->
      <section id="faq" class="max-w-4xl mx-auto px-6 py-28 border-t border-slate-900/60 relative z-10 scroll-mt-20">
        <div class="text-center mb-20">
          <span class="text-xs text-purple-400 font-bold uppercase tracking-widest bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">DÚVIDAS COMUNS</span>
          <h2 class="text-4xl font-extrabold text-white mt-4 tracking-tight">Perguntas Frequentes</h2>
          <p class="text-slate-400 mt-4">Esclareça suas principais dúvidas operacionais e comerciais sobre o OficinaFlow.</p>
        </div>

        <div class="space-y-4">
          <!-- Question 1 -->
          <div class="p-6 rounded-2xl bg-slate-900/10 border border-slate-900 hover:border-purple-500/20 transition-all duration-300">
            <h3 class="text-base font-extrabold text-white flex justify-between items-center cursor-pointer select-none" (click)="toggleFaq(1)">
              <span>O que é a arquitetura SaaS multitenant do OficinaFlow?</span>
              <span class="text-purple-400 font-mono text-xl transition-transform duration-300" [style.transform]="activeFaq() === 1 ? 'rotate(45deg)' : 'none'">+</span>
            </h3>
            @if (activeFaq() === 1) {
              <p class="text-slate-400 text-sm mt-4 leading-relaxed border-t border-slate-900 pt-4 animate-fadeIn">
                Significa que várias oficinas compartilham o mesmo banco de dados de maneira totalmente isolada. Cada oficina possui um identificador único de Tenant. Suas ordens de serviço, veículos e clientes estão seguros e são inacessíveis por qualquer outra oficina do sistema.
              </p>
            }
          </div>

          <!-- Question 2 -->
          <div class="p-6 rounded-2xl bg-slate-900/10 border border-slate-900 hover:border-purple-500/20 transition-all duration-300">
            <h3 class="text-base font-extrabold text-white flex justify-between items-center cursor-pointer select-none" (click)="toggleFaq(2)">
              <span>Preciso realizar pagamento no momento do cadastro?</span>
              <span class="text-purple-400 font-mono text-xl transition-transform duration-300" [style.transform]="activeFaq() === 2 ? 'rotate(45deg)' : 'none'">+</span>
            </h3>
            @if (activeFaq() === 2) {
              <p class="text-slate-400 text-sm mt-4 leading-relaxed border-t border-slate-900 pt-4 animate-fadeIn">
                Sim. Para simular fielmente o funcionamento de um software comercial de assinatura, a etapa de cadastro requer a seleção de um plano de faturamento mensal e o preenchimento dos dados de pagamento (cartão de crédito) simulado. O cadastro é finalizado apenas após a simulação de aprovação da transação de pagamento.
              </p>
            }
          </div>

          <!-- Question 3 -->
          <div class="p-6 rounded-2xl bg-slate-900/10 border border-slate-900 hover:border-purple-500/20 transition-all duration-300">
            <h3 class="text-base font-extrabold text-white flex justify-between items-center cursor-pointer select-none" (click)="toggleFaq(3)">
              <span>Posso convidar funcionários e gerenciar cargos?</span>
              <span class="text-purple-400 font-mono text-xl transition-transform duration-300" [style.transform]="activeFaq() === 3 ? 'rotate(45deg)' : 'none'">+</span>
            </h3>
            @if (activeFaq() === 3) {
              <p class="text-slate-400 text-sm mt-4 leading-relaxed border-t border-slate-900 pt-4 animate-fadeIn">
                Com certeza. Dependendo do seu plano, você pode cadastrar usuários adicionais. Oferecemos controle de cargos (Role-Based Access Control): Administradores têm controle total, Recepcionistas gerenciam clientes e entradas, e Mecânicos podem atualizar ordens de serviço e checklists.
              </p>
            }
          </div>

          <!-- Question 4 -->
          <div class="p-6 rounded-2xl bg-slate-900/10 border border-slate-900 hover:border-purple-500/20 transition-all duration-300">
            <h3 class="text-base font-extrabold text-white flex justify-between items-center cursor-pointer select-none" (click)="toggleFaq(4)">
              <span>Como funciona a impressão de ordens de serviço?</span>
              <span class="text-purple-400 font-mono text-xl transition-transform duration-300" [style.transform]="activeFaq() === 4 ? 'rotate(45deg)' : 'none'">+</span>
            </h3>
            @if (activeFaq() === 4) {
              <p class="text-slate-400 text-sm mt-4 leading-relaxed border-t border-slate-900 pt-4 animate-fadeIn">
                As ordens de serviço e orçamentos possuem um botão de exportação e impressão profissional. O sistema utiliza folhas de estilo específicas de mídia que formatam o documento com alta qualidade, omitindo layouts de navegação secundários e focando inteiramente no documento que será assinado pelo cliente.
              </p>
            }
          </div>
        </div>
      </section>

      <!-- Footer Section -->
      <footer class="border-t border-slate-900/60 py-16 px-6 bg-slate-950">
        <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center font-bold text-white shadow-md shadow-purple-500/20">
              O
            </div>
            <div>
              <span class="text-base font-black text-white tracking-tight">OficinaFlow</span>
              <span class="text-[9px] text-slate-500 block -mt-1 uppercase tracking-widest">SaaS Solutions</span>
            </div>
          </div>

          <p class="text-xs text-slate-500 font-mono text-center md:text-left">
            &copy; 2026 OficinaFlow. Desenvolvido para Centros Automotivos de Elite. Todos os direitos reservados.
          </p>

          <div class="flex items-center gap-6 text-xs font-semibold text-slate-400">
            <a href="#" class="hover:text-purple-400 transition-colors">Termos de Uso</a>
            <a href="#" class="hover:text-purple-400 transition-colors">Privacidade</a>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn {
      animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  `]
})
export class HomeComponent {
  readonly authService = inject(AuthService);

  readonly activeFaq = signal<number | null>(null);
  readonly activeMockupTab = signal<'checklist' | 'finance' | 'flow'>('checklist');
  readonly selectedTier = signal<'bronze' | 'prata' | 'ouro'>('prata');

  toggleFaq(faqId: number): void {
    if (this.activeFaq() === faqId) {
      this.activeFaq.set(null);
    } else {
      this.activeFaq.set(faqId);
    }
  }

  scrollToSection(sectionId: string, event: Event): void {
    event.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
