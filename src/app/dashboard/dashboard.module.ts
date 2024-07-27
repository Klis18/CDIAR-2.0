import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardCdiarComponent } from './dashboard-cdiar/dashboard-cdiar.component';
import { MaterialModule } from '../material/material.module';
import { BaseChartDirective } from 'ng2-charts';


@NgModule({
  declarations: [
    DashboardCdiarComponent,
    
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MaterialModule,
    BaseChartDirective
  ],
  exports: [
    DashboardCdiarComponent
  ],
  
})
export class DashboardModule { }
