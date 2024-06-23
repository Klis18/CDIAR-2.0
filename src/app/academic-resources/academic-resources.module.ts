import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { ResourcesTableComponent } from './components/resources-table/resources-table.component';
import { AddResourceComponent } from './components/add-resource/add-resource.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EditResourceComponent } from './components/edit-resource/edit-resource.component';
import { SharedModule } from '../shared/shared.module';
import { ResourcesFormComponent } from './components/resources-form/resources-form.component';
import { ResourcesComponent } from './pages/resources/resources.component';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    AddResourceComponent,
    EditResourceComponent,
    ResourcesFormComponent,
    ResourcesComponent,
    ResourcesTableComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    SharedModule,
  ],
  exports: [
    ResourcesTableComponent,
  ],
})
export class AcademicResourcesModule {}
