import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { MaterialModule } from '../material/material.module';

import * as XLSX from 'xlsx';
import { ReactiveFormsModule } from '@angular/forms';
import { UserReportComponent } from './pages/user-report/user-report.component';
import { UserReportTableComponent } from './components/user-report-table/user-report-table.component';

import { SharedModule } from '../shared/shared.module';
import { SimulatorsTableComponent } from './components/simulators-table/simulators-table.component'; // Import the XLSX module

@NgModule({
  declarations: [
    UserReportComponent,
    UserReportTableComponent,
    SimulatorsTableComponent,
  ],
  imports: [CommonModule, ReportsRoutingModule, MaterialModule, SharedModule, ReactiveFormsModule],
})
export class ReportsModule {}
