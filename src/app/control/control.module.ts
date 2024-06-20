import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControlRoutingModule } from './control-routing.module';
import { ListadoAprobacionDocenteComponent } from './components/listado-aprobacion-docente/listado-aprobacion-docente.component';
import { AprobarDocentesComponent } from './pages/aprobar-docentes/aprobar-docentes.component';
import { AsignarRevisorComponent } from './pages/asignar-revisor/asignar-revisor.component';
import { CargaHorariaComponent } from './pages/carga-horaria/carga-horaria.component';
import { AcademicResourcesModule } from '../academic-resources/academic-resources.module';
import { MaterialModule } from '../material/material.module';
import { ListadoCargaDocenteComponent } from './components/listado-carga-docente/listado-carga-docente.component';
import { LearnModule } from '../learn/learn.module';
import { ListRevisorComponent } from './components/list-revisor/list-revisor.component';


@NgModule({
  declarations: [
    ListadoAprobacionDocenteComponent,
    AprobarDocentesComponent,
    AsignarRevisorComponent,
    CargaHorariaComponent,
    ListadoCargaDocenteComponent,
    ListRevisorComponent
  ],
  imports: [
    CommonModule,
    ControlRoutingModule,
    AcademicResourcesModule,
    MaterialModule,
    LearnModule
  ],
  exports:[
    ListadoAprobacionDocenteComponent
  ],
  providers: [
    {
      provide:AsignarRevisorComponent,
      useClass: AsignarRevisorComponent
    }
  ]
})
export class ControlModule { }
