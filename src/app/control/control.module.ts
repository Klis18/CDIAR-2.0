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
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectRevisorComponent } from './components/select-revisor/select-revisor.component';
import { SimulatorsModule } from '../simulators/simulators.module';
import { MallaAcademicaComponent } from './pages/malla-academica/malla-academica.component';
import { AddMallaAcademicaComponent } from './components/add-malla-academica/add-malla-academica.component';
import { ListAsignaturasComponent } from './components/list-asignaturas/list-asignaturas.component';
import { ListNivelesComponent } from './components/list-niveles/list-niveles.component';
import { MallaAcademicaFormComponent } from './components/malla-academica-form/malla-academica-form.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { EditMallaAcademicaComponent } from './components/edit-malla-academica/edit-malla-academica.component';
import { ListDocentesComponent } from './components/list-docentes/list-docentes.component';
import { MatDialogRef } from '@angular/material/dialog';
import { ViewCargaHorariaComponent } from './components/view-carga-horaria/view-carga-horaria.component';
import { CargaHorariaDocenteModule } from '../carga-horaria-docente/carga-horaria-docente.module';


@NgModule({
  declarations: [
    ListadoAprobacionDocenteComponent,
    AprobarDocentesComponent,
    AsignarRevisorComponent,
    CargaHorariaComponent,
    ListadoCargaDocenteComponent,
    ListRevisorComponent,
    SelectRevisorComponent,
    MallaAcademicaComponent,
    AddMallaAcademicaComponent,
    ListAsignaturasComponent,
    ListNivelesComponent,
    MallaAcademicaFormComponent,
    EditMallaAcademicaComponent,
    ListDocentesComponent,
    ViewCargaHorariaComponent
  ],
  imports: [
    CommonModule,
    ControlRoutingModule,
    AcademicResourcesModule,
    MaterialModule,
    LearnModule,
    SharedModule,
    SimulatorsModule,
    ReactiveFormsModule,
    NgSelectModule,
    CargaHorariaDocenteModule
  ],
  exports:[
    ListadoAprobacionDocenteComponent
  ],
  providers: [
    {
      provide:AsignarRevisorComponent,
      useClass: AsignarRevisorComponent
    },
    {
      provide: MatDialogRef,
      useClass: CargaHorariaComponent
    },
    {
      provide: MallaAcademicaComponent,
      useClass: MallaAcademicaComponent
    }
  ]
})
export class ControlModule { }
