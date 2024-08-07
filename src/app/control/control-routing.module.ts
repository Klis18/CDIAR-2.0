import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AprobarDocentesComponent } from './pages/aprobar-docentes/aprobar-docentes.component';
import { AsignarRevisorComponent } from './pages/asignar-revisor/asignar-revisor.component';
import { CargaHorariaComponent } from './pages/carga-horaria/carga-horaria.component';
import { MallaAcademicaComponent } from './pages/malla-academica/malla-academica.component';

const routes: Routes = [
 
      {
        path: 'aprobar-docentes',
        component: AprobarDocentesComponent
      },
      {
        path:'asignar-revisor',
        component: AsignarRevisorComponent,
      },
      {
        path:'carga-horaria',
        component: CargaHorariaComponent
      },
      {
        path:'malla-academica',
        component: MallaAcademicaComponent
      }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ControlRoutingModule { }
