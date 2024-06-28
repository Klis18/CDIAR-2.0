import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CargaHorariaComponent } from './pages/carga-horaria/carga-horaria.component';

const routes: Routes = [
    {
      path: '',
      component: CargaHorariaComponent
  },
  {
      path: '**',
      redirectTo: '',
      pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocenteRoutingModule { }
