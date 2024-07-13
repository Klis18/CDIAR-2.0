import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardCdiarComponent } from './dashboard-cdiar/dashboard-cdiar.component';
import { MaterialModule } from '../material/material.module';


@NgModule({
  declarations: [
    DashboardCdiarComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MaterialModule
  ],
  exports: [
    DashboardCdiarComponent
  ]
})
export class DashboardModule { }
