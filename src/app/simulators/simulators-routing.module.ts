import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SimulatorsComponent } from './pages/simulators/simulators.component';
import { QuestionsSimulatorsComponent } from './pages/questions-simulators/questions-simulators.component';
import { StartSimulatorComponent } from './pages/start-simulator/start-simulator.component';

const routes: Routes = [
  {
    path: 'repositorio-simuladores',
    component: SimulatorsComponent,
  },
  {
    path:'preguntas',
    component: QuestionsSimulatorsComponent,
  },
  {
    path:'iniciar-simulador',
    component: StartSimulatorComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SimulatorsRoutingModule { }
