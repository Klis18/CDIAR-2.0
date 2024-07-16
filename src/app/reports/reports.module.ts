import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { UserReportsComponent } from './pages/user-reports/user-reports.component';
import { SimulatorsReportsComponent } from './pages/simulators-reports/simulators-reports.component';
import { UserTableComponent } from './components/user-table/user-table.component';
import { MaterialModule } from '../material/material.module';
import * as XLSX from 'xlsx';
import { SharedModule } from '../shared/shared.module'; // Import the XLSX module
import { ReactiveFormsModule } from '@angular/forms';
import { UserReportComponent } from './pages/user-report/user-report.component';
import { UserReportTableComponent } from './components/user-report-table/user-report-table.component';

@NgModule({
  declarations: [
    UserReportsComponent,
    SimulatorsReportsComponent,
    UserTableComponent,
    UserReportComponent,
    UserReportTableComponent,
  ],
  imports: [CommonModule, ReportsRoutingModule, MaterialModule, SharedModule, ReactiveFormsModule],
})
export class ReportsModule {}
