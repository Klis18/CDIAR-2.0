import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SimulatorsRoutingModule } from './simulators-routing.module';
import { SimulatorsComponent } from './pages/simulators/simulators.component';
import { CardsSimulatorsComponent } from './components/cards-simulators/cards-simulators.component';
import { MaterialModule } from '../material/material.module';


@NgModule({
  declarations: [
    SimulatorsComponent,
    CardsSimulatorsComponent
  ],
  imports: [
    CommonModule,
    SimulatorsRoutingModule,
    MaterialModule
  ]
})
export class SimulatorsModule { }
