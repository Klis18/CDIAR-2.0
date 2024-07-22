import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsRoutingModule } from './reports-routing.module';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { UserReportTableComponent } from './components/user-report-table/user-report-table.component';

import { SharedModule } from '../shared/shared.module';
import { SimulatorsTableComponent } from './components/simulators-table/simulators-table.component'; // Import the XLSX module
import { UserReportsComponent } from './pages/user-reports/user-reports.component';
import { UserReportComponent } from './pages/user-report/user-report.component';
import { SimulatorsReportsComponent } from './pages/simulators-reports/simulators-reports.component';

@NgModule({
  declarations: [
    UserReportsComponent,
    UserReportTableComponent,
    SimulatorsTableComponent,
    UserReportComponent,
    UserReportTableComponent,
    SimulatorsReportsComponent,
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    MaterialModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class ReportsModule {}
