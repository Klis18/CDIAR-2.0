import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SimulatorsRoutingModule } from './simulators-routing.module';
import { SimulatorsComponent } from './pages/simulators/simulators.component';
import { CardsSimulatorsComponent } from './components/cards-simulators/cards-simulators.component';


@NgModule({
  declarations: [
    SimulatorsComponent,
    CardsSimulatorsComponent
  ],
  imports: [
    CommonModule,
    SimulatorsRoutingModule
  ]
})
export class SimulatorsModule { }
