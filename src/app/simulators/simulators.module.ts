import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SimulatorsRoutingModule } from './simulators-routing.module';
import { SimulatorsComponent } from './pages/simulators/simulators.component';


@NgModule({
  declarations: [
    SimulatorsComponent
  ],
  imports: [
    CommonModule,
    SimulatorsRoutingModule
  ]
})
export class SimulatorsModule { }
