import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserReportsComponent } from './pages/user-reports/user-reports.component';
import { SimulatorsReportsComponent } from './pages/simulators-reports/simulators-reports.component';

const routes: Routes = [
  {
    path: 'user-report',
    component: UserReportsComponent
  },
  {
    path:'simulators-report',
    component: SimulatorsReportsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
