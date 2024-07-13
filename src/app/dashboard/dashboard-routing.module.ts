import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardCdiarComponent } from './dashboard-cdiar/dashboard-cdiar.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardCdiarComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
