import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CargaHorariaDocenteComponent } from './pages/carga-horaria-docente/carga-horaria-docente.component';
import { AuthGuard } from '../auth/guards/auth.guard';

const routes: Routes = [
  {
    path:'carga-horaria',
    component: CargaHorariaDocenteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CargaHorariaDocenteRoutingModule { }
