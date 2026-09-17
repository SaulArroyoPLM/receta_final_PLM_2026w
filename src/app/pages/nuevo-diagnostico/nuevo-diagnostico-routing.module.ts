import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NuevoDiagnosticoPage } from './nuevo-diagnostico.page';

const routes: Routes = [
  {
    path: '',
    component: NuevoDiagnosticoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NuevoDiagnosticoPageRoutingModule {}
