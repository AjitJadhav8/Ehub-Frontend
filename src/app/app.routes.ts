import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // default -> login
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

  // auth (login, register etc) - not protected
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login.component').then(m => m.LoginComponent)
      },
      // add other auth children like register/forgot-password here
    ]
  },

  // protected area (dashboard, customers, ...)
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'customers',
        loadComponent: () =>
          import('./features/customer/customer-main/customer-main.component').then(m => m.CustomerMainComponent)
      },
      {
        path: 'cluster-chart',
        loadComponent: () =>
          import('./features/customer/cluster-scatter-chart/cluster-scatter-chart.component')
            .then(m => m.ClusterScatterChartComponent)
      },
      // Add survey dashboard route
      {
        path: 'survey-dashboard',
        loadComponent: () =>
          import('./features/survey-dashboard/survey-dashboard/survey-dashboard.component')
            .then(m => m.SurveyDashboardComponent)
      },
      // add more protected routes here
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // fallback
  { path: '**', redirectTo: 'auth/login' }
];