import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MetasYRendimientoRoutingModule } from './metas-y-rendimiento-routing.module';
import { MetasFormComponent } from './components/metas-form/metas-form.component';
import { AddMetaComponent } from './components/add-meta/add-meta.component';
import { EditMetaComponent } from './components/edit-meta/edit-meta.component';
import { MetaTableComponent } from './components/meta-table/meta-table.component';
import { MetasComponent } from './pages/metas/metas.component';
import { RendimientoComponent } from './pages/rendimiento/rendimiento.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../shared/shared.module';
import { ControlModule } from '../control/control.module';
import { ReportsModule } from '../reports/reports.module';


@NgModule({
  declarations: [
    MetasFormComponent,
    AddMetaComponent,
    EditMetaComponent,
    MetaTableComponent,
    MetasComponent,
    RendimientoComponent
  ],
  imports: [
    CommonModule,
    MetasYRendimientoRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    NgSelectModule,
    SharedModule,
    ReportsModule
  ]
})
export class MetasYRendimientoModule { }
