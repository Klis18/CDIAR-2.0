import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeLayoutComponent } from './home-layout/home-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { MaterialModule } from '../material/material.module';
import { ProfileComponent } from './pages/profile/profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { DocenteModule } from '../docente/docente.module';
import { SharedModule } from '../shared/shared.module';
import { AcademicResourcesModule } from '../academic-resources/academic-resources.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { StudyFormComponent } from './components/study-form/study-form.component';
import { DashboardModule } from '../dashboard/dashboard.module';


@NgModule({
  declarations: [
    HomeLayoutComponent,
    HomeComponent,
    ProfileComponent,
    ChangePasswordComponent,
    StudyFormComponent,

  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MaterialModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    DocenteModule,
    SharedModule,   
    DashboardModule
  ],
})
export class HomeModule {}
