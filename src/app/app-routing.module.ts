import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./pages/HomeComponent/homeComponent').then(m => m.HomeComponent)
    // ↑ loadComponent porque ES standalone
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
    // ↑ loadChildren porque ES un módulo
  },
  {
    path: 'nuevo-diagnostico',
    loadChildren: () => import('./pages/nuevo-diagnostico/nuevo-diagnostico-routing.module').then(m => m.NuevoDiagnosticoPageRoutingModule)
    // ↑ loadChildren porque ES un módulo
  },
  {
    path: 'consultar-medicamentos',
    loadComponent: () => import('./pages/consultar-medicamentos/consultar-medicamentos.page').then(m => m.ConsultarMedicamentosPage)
    // ↑ loadComponent porque ES standalone
  },
  {
    path: 'datos-personales',
    loadComponent: () => import('./pages/datos-personales/datos-personales.page').then(m => m.DatosPersonalesPage)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }