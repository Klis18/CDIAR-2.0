import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsRoutingModule } from './reports-routing.module';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { UserReportTableComponent } from './components/user-report-table/user-report-table.component';

import { SharedModule } from '../shared/shared.module';
import { SimulatorsTableComponent } from './components/simulators-table/simulators-table.component'; // Import the XLSX module
import { UserReportsComponent } from './pages/user-reports/user-reports.component';
import { SimulatorsReportsComponent } from './pages/simulators-reports/simulators-reports.component';
import { VideolearnsReportsComponent } from './pages/videolearns-reports/videolearns-reports.component';
import { VideolearnTableComponent } from './components/videolearn-table/videolearn-table.component';

@NgModule({
  declarations: [
    UserReportsComponent,
    UserReportTableComponent,
    SimulatorsTableComponent,
    UserReportTableComponent,
    SimulatorsReportsComponent,
    VideolearnsReportsComponent,
    VideolearnTableComponent,
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    MaterialModule,
    SharedModule,
    ReactiveFormsModule,
  ],
  exports: [
    VideolearnTableComponent,
    SimulatorsTableComponent,
  ]
})
export class ReportsModule {}
