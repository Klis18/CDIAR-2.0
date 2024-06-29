import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SimulatorsRoutingModule } from './simulators-routing.module';
import { SimulatorsComponent } from './pages/simulators/simulators.component';
import { CardsSimulatorsComponent } from './components/cards-simulators/cards-simulators.component';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DetailsSimulatorComponent } from './components/details-simulator/details-simulator.component';
import { AddSimulatorComponent } from './components/add-simulator/add-simulator.component';
import { FormSimulatorComponent } from './components/form-simulator/form-simulator.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    SimulatorsComponent,
    CardsSimulatorsComponent,
    DetailsSimulatorComponent,
    AddSimulatorComponent,
    FormSimulatorComponent,
  ],
  imports: [
    CommonModule,
    SimulatorsRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class SimulatorsModule { }
