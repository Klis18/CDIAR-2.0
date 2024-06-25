import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { UserReportsComponent } from './pages/user-reports/user-reports.component';
import { SimulatorsReportsComponent } from './pages/simulators-reports/simulators-reports.component';
import { UserTableComponent } from './components/user-table/user-table.component';
import { MaterialModule } from '../material/material.module';


@NgModule({
  declarations: [
    UserReportsComponent,
    SimulatorsReportsComponent,
    UserTableComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    MaterialModule
  ]
})
export class ReportsModule { }
