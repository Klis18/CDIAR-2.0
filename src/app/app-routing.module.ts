import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';
import { HomeLayoutComponent } from './home/home-layout/home-layout.component';
import { ResourcesComponent } from './academic-resources/pages/resources/resources.component';
import { CargaHorariaComponent } from './docente/pages/carga-horaria/carga-horaria.component';
import { FlashcardsComponent } from './learn/pages/flashcards/flashcards.component';
import { SimulatorsComponent } from './simulators/pages/simulators/simulators.component';

const routes: Routes = [
  {
    path:'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: '',
    component: HomeLayoutComponent, 
    children: [
      {
        path: 'home',
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
      },
      {
        path:'academic-resources',
        component: ResourcesComponent,
        loadChildren: () => import('./academic-resources/academic-resources.module').then(m => m.AcademicResourcesModule),
      },
      {
        path:'control-security',
        loadChildren: () => import('./control/control.module').then(m => m.ControlModule),
      },
      {
        path:'carga-horaria',
        component: CargaHorariaComponent,
        loadChildren: () => import('./docente/docente.module').then(m => m.DocenteModule),
      },
      {
        path:'learn',
        // component: FlashcardsComponent,
        loadChildren: () => import('./learn/learn.module').then(m => m.LearnModule),
      },
      {
        path: 'simuladores',
        // component: SimulatorsComponent,
        loadChildren: () => import('./simulators/simulators.module').then(m => m.SimulatorsModule),
      },
      {
        path: 'reports',
        loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule)
      }
      
    ],
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: 'auth',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
