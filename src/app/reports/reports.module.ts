import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { UserReportsComponent } from './pages/user-reports/user-reports.component';
import { SimulatorsReportsComponent } from './pages/simulators-reports/simulators-reports.component';
import { UserTableComponent } from './components/user-table/user-table.component';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { SimulatorsTableComponent } from './components/simulators-table/simulators-table.component'; // Import the XLSX module

@NgModule({
  declarations: [
    UserReportsComponent,
    SimulatorsReportsComponent,
    UserTableComponent,
    SimulatorsTableComponent,
  ],
  imports: [CommonModule, ReportsRoutingModule, MaterialModule, SharedModule],
})
export class ReportsModule {}
