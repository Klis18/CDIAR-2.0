import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CargaHorariaDocenteRoutingModule } from './carga-horaria-docente-routing.module';
import { CargaPreTableComponent } from './components/carga-pre-table/carga-pre-table.component';
import { CargaHorariaFormComponent } from './components/carga-horaria-form/carga-horaria-form.component';
import { AddCargaHorariaComponent } from './components/add-carga-horaria/add-carga-horaria.component';
import { EditCargaHorariaComponent } from './components/edit-carga-horaria/edit-carga-horaria.component';
import { CargaHorariaDocenteComponent } from './pages/carga-horaria-docente/carga-horaria-docente.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { ListCargaHorariaComponent } from './components/list-carga-horaria/list-carga-horaria.component';
import { EditCargaHorariaFormComponent } from './components/edit-carga-horaria-form/edit-carga-horaria-form.component';
import { CargaHorariaFiltersComponent } from './components/carga-horaria-filters/carga-horaria-filters.component';


@NgModule({
  declarations: [
    CargaPreTableComponent,
    CargaHorariaFormComponent,
    AddCargaHorariaComponent,
    EditCargaHorariaComponent,
    CargaHorariaDocenteComponent,
    ListCargaHorariaComponent,
    EditCargaHorariaFormComponent,
    CargaHorariaFiltersComponent
  ],
  imports: [
    CommonModule,
    CargaHorariaDocenteRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    NgSelectModule
  ],
  exports: [
    CargaHorariaFiltersComponent
  ]
})
export class CargaHorariaDocenteModule { }
