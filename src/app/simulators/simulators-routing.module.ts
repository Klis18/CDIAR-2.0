import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SimulatorsComponent } from './pages/simulators/simulators.component';
import { QuestionsSimulatorsComponent } from './pages/questions-simulators/questions-simulators.component';
import { StartSimulatorComponent } from './pages/start-simulator/start-simulator.component';
import { AuthGuard } from '../auth/guards/auth.guard';

const routes: Routes = [
  {
    path: 'repositorio-simuladores',
    component: SimulatorsComponent,
    canActivate: [AuthGuard],
    canMatch: [AuthGuard],
    data: { roles: ['Estudiante', 'Docente'] },
  },
  {
    path:'preguntas',
    component: QuestionsSimulatorsComponent,
    canActivate: [AuthGuard],
    canMatch: [AuthGuard],
    data: { roles: ['Admin','Estudiante', 'Docente'] },
  },
  {
    path:'iniciar-simulador',
    component: StartSimulatorComponent,
    canActivate: [AuthGuard],
    canMatch: [AuthGuard],
    data: { roles: ['Estudiante', 'Docente'] },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SimulatorsRoutingModule { }
