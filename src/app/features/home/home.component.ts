import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-hidden selection:bg-purple-500 selection:text-white">
      <!-- Ambient Glow Effects -->
      <div class="absolute -top-40 -left-40 w-96 h-96 bg-purple-600 rounded-full blur-[160px] opacity-20 pointer-events-none"></div>
      <div class="absolute top-[40%] right-[-100px] w-96 h-96 bg-blue-600 rounded-full blur-[160px] opacity-15 pointer-events-none"></div>
      <div class="absolute bottom-[-100px] left-[20%] w-[500px] h-[500px] bg-purple-700/10 rounded-full blur-[180px] opacity-20 pointer-events-none"></div>

      <!-- Navigation Header -->
      <header class="sticky top-0 z-50 bg-slate-950/70 backdrop-blur-md border-b border-slate-900/80 px-6 py-4">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/20">
              G
            </div>
            <div>
              <span class="text-lg font-bold tracking-tight text-white">Gandalf</span>
              <span class="text-[9px] text-purple-400 block -mt-1 font-semibold uppercase tracking-wider">SaaS de Gestão</span>
            </div>
          </div>

          <!-- Mid Navigation Links -->
          <nav class="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#recursos" class="hover:text-purple-400 transition-colors">Recursos</a>
            <a href="#como-funciona" class="hover:text-purple-400 transition-colors">Como Funciona</a>
            <a href="#precos" class="hover:text-purple-400 transition-colors">Planos & Preços</a>
            <a href="#faq" class="hover:text-purple-400 transition-colors">Dúvidas</a>
          </nav>

          <!-- CTAs -->
          <div class="flex items-center gap-4">
            @if (authService.isAuthenticated()) {
              <a
                routerLink="/dashboard"
                class="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/20 transition hover:scale-[1.02] active:scale-[0.98] text-sm flex items-center gap-2"
              >
                <span>Ir para o Painel</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
            } @else {
              <a
                routerLink="/login"
                class="text-sm font-semibold text-slate-300 hover:text-white transition px-4 py-2"
              >
                Entrar
              </a>
              <a
                routerLink="/register"
                class="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm font-semibold hover:bg-slate-800 text-white hover:border-slate-700 transition"
              >
                Criar Conta
              </a>
            }
          </div>
        </div>
      </header>

      <!-- Hero Section -->
      <section class="max-w-7xl mx-auto px-6 pt-20 pb-24 text-center relative z-10">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse">
          ⚡ Nova Versão: Checklist Digital com Fotos
        </span>

        <h1 class="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
          Gerencie sua Oficina Mecânica <br>
          <span class="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-blue-400 bg-clip-text text-transparent">
            Totalmente sem Papel e Sem Caos
          </span>
        </h1>

        <p class="text-slate-400 text-lg md:text-xl mt-6 max-w-2xl mx-auto leading-relaxed">
          O Gandalf é a plataforma SaaS definitiva para organizar a entrada de veículos, gerar checklists digitais interativos com fotos de avarias, criar orçamentos e controlar ordens de serviço.
        </p>

        <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            routerLink="/register"
            [queryParams]="{ plan: 'PRATA' }"
            class="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white font-bold rounded-xl shadow-xl shadow-purple-500/10 hover:shadow-purple-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-base"
          >
            Começar Agora (Plano Prata)
          </a>
          <a
            href="#recursos"
            class="w-full sm:w-auto px-8 py-4 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 rounded-xl font-semibold text-slate-300 hover:text-white transition"
          >
            Conhecer Recursos
          </a>
        </div>

        <!-- Simulated App Mockup Dashboard -->
        <div class="mt-16 relative mx-auto max-w-5xl rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 backdrop-blur-xl shadow-2xl overflow-hidden group">
          <div class="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
          
          <!-- Mockup Header -->
          <div class="flex items-center justify-between pb-4 border-b border-slate-800/60 mb-4">
            <div class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-full bg-red-500/70"></span>
              <span class="w-3 h-3 rounded-full bg-yellow-500/70"></span>
              <span class="w-3 h-3 rounded-full bg-green-500/70"></span>
              <span class="text-xs text-slate-500 ml-2 font-mono">painel.gandalf.com.br/dashboard</span>
            </div>
            <div class="w-24 h-4 bg-slate-800/80 rounded-md"></div>
          </div>

          <!-- Mockup Grid Content -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div class="p-5 bg-slate-950/80 border border-slate-800/50 rounded-xl">
              <div class="flex items-center justify-between text-xs text-slate-400 mb-2 font-semibold">
                <span>ÚLTIMOS VEÍCULOS</span>
                <span class="text-purple-400 font-mono">3 Ativos</span>
              </div>
              <div class="space-y-2 text-sm mt-3">
                <div class="flex justify-between items-center py-1.5 border-b border-slate-900">
                  <span class="font-medium text-slate-200">BMW M3 - 2023</span>
                  <span class="px-2 py-0.5 rounded text-[10px] bg-green-950 text-green-400 border border-green-800/30">Placa: GDF-1234</span>
                </div>
                <div class="flex justify-between items-center py-1.5 border-b border-slate-900">
                  <span class="font-medium text-slate-200">Audi RS6 - 2022</span>
                  <span class="px-2 py-0.5 rounded text-[10px] bg-green-950 text-green-400 border border-green-800/30">Placa: OS-9876</span>
                </div>
                <div class="flex justify-between items-center py-1.5">
                  <span class="font-medium text-slate-200">Porsche 911 GT3</span>
                  <span class="px-2 py-0.5 rounded text-[10px] bg-yellow-950/60 text-yellow-400 border border-yellow-800/20">Placa: GT3-9111</span>
                </div>
              </div>
            </div>

            <div class="p-5 bg-slate-950/80 border border-slate-800/50 rounded-xl">
              <div class="flex items-center justify-between text-xs text-slate-400 mb-2 font-semibold">
                <span>CHECKLIST DIGITAL DE ENTRADA</span>
                <span class="text-blue-400">Padrão</span>
              </div>
              <div class="mt-4 space-y-3">
                <div class="flex items-center gap-2 text-xs text-slate-300">
                  <span class="w-2 h-2 rounded-full bg-green-500"></span>
                  <span>Nível Combustível: 3/4 Tanque</span>
                </div>
                <div class="flex items-center gap-2 text-xs text-slate-300">
                  <span class="w-2 h-2 rounded-full bg-green-500"></span>
                  <span>Quilometragem: 45.320 KM</span>
                </div>
                <div class="flex items-center gap-2 text-xs text-slate-300">
                  <span class="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                  <span>Fotos de Avarias: 4 Anexadas</span>
                </div>
              </div>
            </div>

            <div class="p-5 bg-slate-950/80 border border-slate-800/50 rounded-xl">
              <div class="flex items-center justify-between text-xs text-slate-400 mb-2 font-semibold">
                <span>RESUMO DE FATURAMENTO</span>
                <span class="text-green-400">Total Previsto</span>
              </div>
              <p class="text-3xl font-extrabold text-white mt-4 font-mono">R$ 14.850,00</p>
              <div class="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                <div class="bg-gradient-to-r from-purple-500 to-blue-500 h-full w-[78%]"></div>
              </div>
              <span class="text-[10px] text-slate-500 mt-2 block">78% das metas mensais alcançadas</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section id="recursos" class="max-w-7xl mx-auto px-6 py-24 border-t border-slate-900 relative z-10 scroll-mt-10">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-white">Equipado com Tudo que Sua Oficina Precisa</h2>
          <p class="text-slate-400 text-base mt-3 max-w-2xl mx-auto">
            Substitua a burocracia de papeladas, fichas perdidas e fotos desorganizadas no WhatsApp por um fluxo automatizado.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-purple-500/40 transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between">
            <div>
              <div class="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="text-lg font-bold text-white">Checklists Digitais</h3>
              <p class="text-slate-400 text-sm mt-3 leading-relaxed">
                Faça vistorias completas na entrada. Defina nível de combustível, registre a quilometragem atual, adicione fotos de avarias diretamente do smartphone e anexe ao cadastro do veículo.
              </p>
            </div>
          </div>

          <!-- Feature 2 -->
          <div class="p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-purple-500/40 transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between">
            <div>
              <div class="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <h3 class="text-lg font-bold text-white">Ordens de Serviço Dinâmicas</h3>
              <p class="text-slate-400 text-sm mt-3 leading-relaxed">
                Monitore o status da OS em tempo real (Na Fila, Orçamento, Aprovado, Executando, Aguardando Peças, Concluído). O sistema calcula os totais automaticamente com base em peças e mão de obra vinculados.
              </p>
            </div>
          </div>

          <!-- Feature 3 -->
          <div class="p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-purple-500/40 transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between">
            <div>
              <div class="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17L17.25 21A2.67 2.67 0 0021 17.25l-5.83-5.83M11.42 15.17l-3.76-.096a.75.75 0 01-.652-.652L7 10.67M11.42 15.17L9.5 17.1M7 10.67l-5.83-5.83A2.67 2.67 0 014.75 1L10.58 6.83M7 10.67l.096-3.76a.75.75 0 01.652-.652L11.5 6.17M9.5 17.1L4.5 22.1M9.5 17.1L12.5 20.1M11.5 6.17l5.83-5.83A2.67 2.67 0 0121 4.75l-5.83 5.83M11.5 6.17l3.76.096a.75.75 0 01.652.652L17 10.33" />
                </svg>
              </div>
              <h3 class="text-lg font-bold text-white">Peças e Serviços</h3>
              <p class="text-slate-400 text-sm mt-3 leading-relaxed">
                Cadastre e acompanhe o estoque de peças da sua oficina, definindo códigos de SKU e preços. Gerencie o catálogo de serviços executáveis e os valores-base das horas dos técnicos.
              </p>
            </div>
          </div>

          <!-- Feature 4 -->
          <div class="p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-purple-500/40 transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between">
            <div>
              <div class="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.615 0-1.11-.474-1.12-1.09l-.229-2.66m11.78 0H6.22m12.156-8.562l.067-.01A3 3 0 1012 3.75a3 3 0 10-6.443 2.124l.067.01" />
                </svg>
              </div>
              <h3 class="text-lg font-bold text-white">Impressão e Relatórios</h3>
              <p class="text-slate-400 text-sm mt-3 leading-relaxed">
                Gere orçamentos e Ordens de Serviço profissionais prontos para impressão ou exportação em PDF. Seus clientes recebem relatórios claros e bem estruturados.
              </p>
            </div>
          </div>

          <!-- Feature 5 -->
          <div class="p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-purple-500/40 transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between">
            <div>
              <div class="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <h3 class="text-lg font-bold text-white">Isolamento Multi-tenant</h3>
              <p class="text-slate-400 text-sm mt-3 leading-relaxed">
                Toda oficina cadastrada tem seu subdomínio isolado (slug) e seus dados blindados no backend. Outras oficinas nunca conseguirão enxergar seus clientes ou ordens de serviço.
              </p>
            </div>
          </div>

          <!-- Feature 6 -->
          <div class="p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-purple-500/40 transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between">
            <div>
              <div class="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <h3 class="text-lg font-bold text-white">Gestão Multiusuários</h3>
              <p class="text-slate-400 text-sm mt-3 leading-relaxed">
                Crie contas de acesso com funções específicas (Administradores, Recepcionistas, Mecânicos). Cada cargo acessa e altera apenas o que for de sua responsabilidade.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Steps Section -->
      <section id="como-funciona" class="bg-slate-900/20 py-24 border-t border-slate-900 relative z-10 scroll-mt-10">
        <div class="max-w-7xl mx-auto px-6">
          <div class="text-center mb-16">
            <h2 class="text-3xl font-bold text-white">Digitalização Rápida em 3 Passos</h2>
            <p class="text-slate-400 mt-2">Diga adeus ao papel em menos de 10 minutos.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <!-- Connector Line -->
            <div class="hidden md:block absolute top-16 left-[15%] right-[15%] h-[1px] bg-slate-800 z-0"></div>

            <!-- Step 1 -->
            <div class="text-center relative z-10">
              <div class="w-12 h-12 rounded-full bg-purple-600/10 border border-purple-500/30 text-purple-400 font-bold text-lg flex items-center justify-center mx-auto mb-6">
                1
              </div>
              <h3 class="text-base font-bold text-white">Selecione e Pague</h3>
              <p class="text-slate-400 text-sm mt-2 px-4 leading-relaxed">
                Escolha o plano ideal (Bronze, Prata ou Ouro) e realize o pagamento inicial para liberação da conta SaaS.
              </p>
            </div>

            <!-- Step 2 -->
            <div class="text-center relative z-10">
              <div class="w-12 h-12 rounded-full bg-purple-600/10 border border-purple-500/30 text-purple-400 font-bold text-lg flex items-center justify-center mx-auto mb-6">
                2
              </div>
              <h3 class="text-base font-bold text-white">Cadastre sua Oficina</h3>
              <p class="text-slate-400 text-sm mt-2 px-4 leading-relaxed">
                Insira o nome da sua oficina, crie o subdomínio exclusivo da sua marca (slug) e crie o usuário do administrador.
              </p>
            </div>

            <!-- Step 3 -->
            <div class="text-center relative z-10">
              <div class="w-12 h-12 rounded-full bg-purple-600/10 border border-purple-500/30 text-purple-400 font-bold text-lg flex items-center justify-center mx-auto mb-6">
                3
              </div>
              <h3 class="text-base font-bold text-white">Opere no Digital</h3>
              <p class="text-slate-400 text-sm mt-2 px-4 leading-relaxed">
                Cadastre clientes, veículos, realize checklists com fotos, gere OS e receba orçamentos assinados pelos clientes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Pricing Plans -->
      <section id="precos" class="max-w-7xl mx-auto px-6 py-24 border-t border-slate-900 relative z-10 scroll-mt-10">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-white">Planos Flexíveis para Qualquer Oficina</h2>
          <p class="text-slate-400 text-base mt-3">Escolha a quantidade de recursos e usuários que melhor atendem seu negócio.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          <!-- Bronze Plan -->
          <div class="p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 transition flex flex-col justify-between relative">
            <div>
              <span class="text-slate-400 text-sm font-semibold uppercase tracking-wider">Bronze</span>
              <h3 class="text-base font-bold text-white mt-1">Essencial Digital</h3>
              <div class="mt-4 flex items-baseline">
                <span class="text-3xl font-extrabold text-white font-mono">R$ 99</span>
                <span class="text-slate-400 text-sm ml-1">/mês</span>
              </div>
              <p class="text-slate-400 text-xs mt-2">Ideal para oficinas de um único profissional iniciando no digital.</p>
              
              <ul class="mt-6 space-y-3.5 text-sm text-slate-300 border-t border-slate-800/80 pt-6">
                <li class="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4.5 h-4.5 text-purple-400">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>1 Usuário (Administrador)</span>
                </li>
                <li class="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4.5 h-4.5 text-purple-400">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>Clientes & Veículos Ilimitados</span>
                </li>
                <li class="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4.5 h-4.5 text-purple-400">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>Ordens de Serviço Ilimitadas</span>
                </li>
                <li class="flex items-center gap-2 opacity-50">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4.5 h-4.5 text-slate-500">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span class="line-through">Sem fotos no checklist digital</span>
                </li>
                <li class="flex items-center gap-2 opacity-50">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4.5 h-4.5 text-slate-500">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span class="line-through">Sem suporte prioritário</span>
                </li>
              </ul>
            </div>

            <a
              routerLink="/register"
              [queryParams]="{ plan: 'BRONZE' }"
              class="w-full mt-8 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-center transition"
            >
              Assinar Bronze
            </a>
          </div>

          <!-- Prata Plan (Highlighted / Best Value) -->
          <div class="p-8 rounded-2xl bg-slate-900 border-2 border-purple-500 flex flex-col justify-between relative shadow-2xl shadow-purple-500/5">
            <!-- Glow background behind highlithed -->
            <div class="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-12 bg-purple-600 rounded-full blur-[48px] opacity-25"></div>
            
            <div class="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-purple-500 text-white text-[10px] font-bold uppercase tracking-wider">
              Mais Recomendado
            </div>

            <div>
              <span class="text-purple-400 text-sm font-semibold uppercase tracking-wider">Prata</span>
              <h3 class="text-base font-bold text-white mt-1">Profissional de Alta Performance</h3>
              <div class="mt-4 flex items-baseline">
                <span class="text-4.5xl font-extrabold text-white font-mono">R$ 199</span>
                <span class="text-slate-400 text-sm ml-1">/mês</span>
              </div>
              <p class="text-purple-300 text-xs mt-2">O melhor custo-benefício para oficinas em crescimento.</p>
              
              <ul class="mt-6 space-y-3.5 text-sm text-slate-200 border-t border-slate-800/80 pt-6">
                <li class="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4.5 h-4.5 text-purple-400">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span class="font-semibold text-white">Até 5 Usuários Simultâneos</span>
                </li>
                <li class="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4.5 h-4.5 text-purple-400">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>Clientes & Veículos Ilimitados</span>
                </li>
                <li class="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4.5 h-4.5 text-purple-400">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>Checklist Digital Completo <strong>com Fotos</strong></span>
                </li>
                <li class="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4.5 h-4.5 text-purple-400">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>Estoque de Peças e Serviços</span>
                </li>
                <li class="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4.5 h-4.5 text-purple-400">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>Gerador de OS PDF Impressa</span>
                </li>
              </ul>
            </div>

            <a
              routerLink="/register"
              [queryParams]="{ plan: 'PRATA' }"
              class="w-full mt-8 py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white font-bold rounded-xl text-center shadow-lg shadow-purple-500/10 transition"
            >
              Assinar Prata
            </a>
          </div>

          <!-- Ouro Plan -->
          <div class="p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 transition flex flex-col justify-between">
            <div>
              <span class="text-yellow-500 text-sm font-semibold uppercase tracking-wider">Ouro</span>
              <h3 class="text-base font-bold text-white mt-1">Centro Automotivo</h3>
              <div class="mt-4 flex items-baseline">
                <span class="text-3xl font-extrabold text-white font-mono">R$ 299</span>
                <span class="text-slate-400 text-sm ml-1">/mês</span>
              </div>
              <p class="text-slate-400 text-xs mt-2">Para centros automotivos de grande volume de ordens e faturamento.</p>
              
              <ul class="mt-6 space-y-3.5 text-sm text-slate-300 border-t border-slate-800/80 pt-6">
                <li class="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4.5 h-4.5 text-purple-400">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span class="font-semibold text-white">Usuários Ilimitados</span>
                </li>
                <li class="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4.5 h-4.5 text-purple-400">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>Tudo do plano Prata</span>
                </li>
                <li class="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4.5 h-4.5 text-purple-400">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>Armazenamento Ampliado de Fotos</span>
                </li>
                <li class="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4.5 h-4.5 text-purple-400">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>Relatórios Financeiros Avançados</span>
                </li>
                <li class="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4.5 h-4.5 text-purple-400">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>Suporte Prioritário por WhatsApp</span>
                </li>
              </ul>
            </div>

            <a
              routerLink="/register"
              [queryParams]="{ plan: 'OURO' }"
              class="w-full mt-8 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-center transition"
            >
              Assinar Ouro
            </a>
          </div>
        </div>
      </section>

      <!-- FAQ Section -->
      <section id="faq" class="max-w-4xl mx-auto px-6 py-24 border-t border-slate-900 relative z-10 scroll-mt-10">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-white">Dúvidas Frequentes</h2>
          <p class="text-slate-400 mt-2">Esclareça suas principais dúvidas sobre o funcionamento do Gandalf.</p>
        </div>

        <div class="space-y-4">
          <!-- Question 1 -->
          <div class="p-6 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <h3 class="text-base font-bold text-white flex justify-between items-center cursor-pointer" (click)="toggleFaq(1)">
              <span>O que é a arquitetura SaaS multitenant do Gandalf?</span>
              <span class="text-purple-400 font-mono text-lg font-normal">{{ activeFaq() === 1 ? '−' : '+' }}</span>
            </h3>
            @if (activeFaq() === 1) {
              <p class="text-slate-400 text-sm mt-3 leading-relaxed">
                Significa que várias oficinas compartilham o mesmo banco de dados de maneira totalmente isolada. Cada oficina possui um identificador único de Tenant. Suas ordens de serviço, veículos e clientes estão seguros e são inacessíveis por qualquer outra oficina do sistema.
              </p>
            }
          </div>

          <!-- Question 2 -->
          <div class="p-6 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <h3 class="text-base font-bold text-white flex justify-between items-center cursor-pointer" (click)="toggleFaq(2)">
              <span>Preciso realizar pagamento no momento do cadastro?</span>
              <span class="text-purple-400 font-mono text-lg font-normal">{{ activeFaq() === 2 ? '−' : '+' }}</span>
            </h3>
            @if (activeFaq() === 2) {
              <p class="text-slate-400 text-sm mt-3 leading-relaxed">
                Sim. Para simular fielmente o funcionamento de um software comercial de assinatura, a etapa de cadastro requer a seleção de um plano de faturamento mensal e o preenchimento dos dados de pagamento (cartão de crédito) simulado. O cadastro é finalizado apenas após a simulação de aprovação da transação de pagamento.
              </p>
            }
          </div>

          <!-- Question 3 -->
          <div class="p-6 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <h3 class="text-base font-bold text-white flex justify-between items-center cursor-pointer" (click)="toggleFaq(3)">
              <span>Posso convidar funcionários e gerenciar cargos?</span>
              <span class="text-purple-400 font-mono text-lg font-normal">{{ activeFaq() === 3 ? '−' : '+' }}</span>
            </h3>
            @if (activeFaq() === 3) {
              <p class="text-slate-400 text-sm mt-3 leading-relaxed">
                Com certeza. Dependendo do seu plano, você pode cadastrar usuários adicionais. Oferecemos controle de cargos (Role-Based Access Control): Administradores têm controle total, Recepcionistas gerenciam clientes e entradas, e Mecânicos podem atualizar ordens de serviço e checklists.
              </p>
            }
          </div>

          <!-- Question 4 -->
          <div class="p-6 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <h3 class="text-base font-bold text-white flex justify-between items-center cursor-pointer" (click)="toggleFaq(4)">
              <span>Como funciona a impressão de ordens de serviço?</span>
              <span class="text-purple-400 font-mono text-lg font-normal">{{ activeFaq() === 4 ? '−' : '+' }}</span>
            </h3>
            @if (activeFaq() === 4) {
              <p class="text-slate-400 text-sm mt-3 leading-relaxed">
                As ordens de serviço e orçamentos possuem um botão de exportação e impressão profissional. O sistema utiliza folhas de estilo específicas de mídia que formatam o documento com alta qualidade, omitindo layouts de navegação secundários e focando inteiramente no documento que será assinado pelo cliente.
              </p>
            }
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="border-t border-slate-900/80 py-12 px-6 bg-slate-950">
        <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center font-bold text-white shadow-md shadow-purple-500/20">
              G
            </div>
            <div>
              <span class="text-base font-bold text-white tracking-tight">Gandalf</span>
              <span class="text-[9px] text-slate-500 block -mt-1 uppercase tracking-wider">SaaS Solutions</span>
            </div>
          </div>

          <p class="text-xs text-slate-500 font-mono">
            &copy; 2026 Gandalf. Desenvolvido para Centros Automotivos de Elite. Todos os direitos reservados.
          </p>

          <div class="flex items-center gap-6 text-xs text-slate-400">
            <a href="#" class="hover:text-purple-400 transition">Termos de Uso</a>
            <a href="#" class="hover:text-purple-400 transition">Privacidade</a>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    html {
      scroll-behavior: smooth;
    }
  `]
})
export class HomeComponent {
  readonly authService = inject(AuthService);

  readonly activeFaq = signal<number | null>(null);

  toggleFaq(faqId: number): void {
    if (this.activeFaq() === faqId) {
      this.activeFaq.set(null);
    } else {
      this.activeFaq.set(faqId);
    }
  }
}
