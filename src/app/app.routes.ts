import { Routes } from '@angular/router';
import { authGuard, nonAuthGuard, subscriptionGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
    canActivate: [nonAuthGuard],
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
    canActivate: [nonAuthGuard],
  },
  {
    path: 'subscription',
    loadComponent: () =>
      import('./features/subscription/subscription.component').then((m) => m.SubscriptionComponent),
    canActivate: [authGuard],
  },
  {
    path: 'subscription/callback',
    loadComponent: () =>
      import('./features/subscription/subscription-callback.component').then((m) => m.SubscriptionCallbackComponent),
    canActivate: [authGuard],
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    canActivate: [authGuard, subscriptionGuard],
  },
  {
    path: 'customers',
    loadComponent: () =>
      import('./features/customers/customers.component').then((m) => m.CustomersComponent),
    canActivate: [authGuard, subscriptionGuard],
  },
  {
    path: 'vehicles',
    loadComponent: () =>
      import('./features/vehicles/vehicles.component').then((m) => m.VehiclesComponent),
    canActivate: [authGuard, subscriptionGuard],
  },
  {
    path: 'checklists',
    loadComponent: () =>
      import('./features/checklists/checklists.component').then((m) => m.ChecklistsComponent),
    canActivate: [authGuard, subscriptionGuard],
  },
  {
    path: 'services',
    loadComponent: () =>
      import('./features/services/services.component').then((m) => m.ServicesComponent),
    canActivate: [authGuard, subscriptionGuard],
  },
  {
    path: 'parts',
    loadComponent: () =>
      import('./features/parts/parts.component').then((m) => m.PartsComponent),
    canActivate: [authGuard, subscriptionGuard],
  },
  {
    path: 'work-orders',
    loadComponent: () =>
      import('./features/work-orders/work-orders.component').then((m) => m.WorkOrdersComponent),
    canActivate: [authGuard, subscriptionGuard],
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./features/users/users.component').then((m) => m.UsersComponent),
    canActivate: [authGuard, subscriptionGuard],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
