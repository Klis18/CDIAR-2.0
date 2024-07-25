import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MetasComponent } from './pages/metas/metas.component';
import { RendimientoComponent } from './pages/rendimiento/rendimiento.component';

const routes: Routes = [
  {
    path:'metas',
    component: MetasComponent,
  },
  {
    path:'rendimiento',
    component:RendimientoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MetasYRendimientoRoutingModule { }
