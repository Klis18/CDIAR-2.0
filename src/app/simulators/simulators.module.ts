import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SimulatorsRoutingModule } from './simulators-routing.module';
import { SimulatorsComponent } from './pages/simulators/simulators.component';
import { CardsSimulatorsComponent } from './components/cards-simulators/cards-simulators.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { DetailsSimulatorComponent } from './components/details-simulator/details-simulator.component';
import { AddSimulatorComponent } from './components/add-simulator/add-simulator.component';
import { FormSimulatorComponent } from './components/form-simulator/form-simulator.component';
import { SharedModule } from '../shared/shared.module';
import { QuestionsSimulatorFormComponent } from './components/questions-simulator-form/questions-simulator-form.component';
import { AddQuestionSimulatorComponent } from './components/add-question-simulator/add-question-simulator.component';
import { QuestionsSimulatorsComponent } from './pages/questions-simulators/questions-simulators.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { QuestionsSimulatorsTablesComponent } from './components/questions-simulators-tables/questions-simulators-tables.component';
import { EditSimulatorComponent } from './components/edit-simulator/edit-simulator.component';
import { EditQuestionSimulatorComponent } from './components/edit-question-simulator/edit-question-simulator.component';
import { ObservacionRechazoSimuladoresComponent } from './components/observacion-rechazo-simuladores/observacion-rechazo-simuladores.component';
import { SavedSimulatorsTableComponent } from './components/saved-simulators-table/saved-simulators-table.component';
import { StartSimulatorComponent } from './pages/start-simulator/start-simulator.component';


@NgModule({
  declarations: [
    SimulatorsComponent,
    CardsSimulatorsComponent,
    DetailsSimulatorComponent,
    AddSimulatorComponent,
    FormSimulatorComponent,
    QuestionsSimulatorFormComponent,
    AddQuestionSimulatorComponent,
    QuestionsSimulatorsComponent,
    QuestionsSimulatorsTablesComponent,
    EditSimulatorComponent,
    EditQuestionSimulatorComponent,
    ObservacionRechazoSimuladoresComponent,
    SavedSimulatorsTableComponent,
    StartSimulatorComponent
  ],
  imports: [
    CommonModule,
    SimulatorsRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule,
    NgSelectModule,
    FormsModule,
  ],
  exports: [
    CardsSimulatorsComponent
  ],
  providers:[
    SimulatorsComponent
  ]
})
export class SimulatorsModule { }
