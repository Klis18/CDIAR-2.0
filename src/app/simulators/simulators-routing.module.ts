import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SimulatorsComponent } from './pages/simulators/simulators.component';
import { QuestionsSimulatorsComponent } from './pages/questions-simulators/questions-simulators.component';

const routes: Routes = [
  {
    path: 'repositorio-simuladores',
    component: SimulatorsComponent,
  },
  {
    path:'preguntas',
    component: QuestionsSimulatorsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SimulatorsRoutingModule { }
