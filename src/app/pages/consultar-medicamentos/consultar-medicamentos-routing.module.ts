import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsultarMedicamentosPage } from './consultar-medicamentos.page';

const routes: Routes = [
  {
    path: '',
    component: ConsultarMedicamentosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsultarMedicamentosPageRoutingModule {}
