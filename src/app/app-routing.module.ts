import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';
import { HomeLayoutComponent } from './home/home-layout/home-layout.component';
import { ResourcesComponent } from './academic-resources/pages/resources/resources.component';
import { DashboardCdiarComponent } from './dashboard/dashboard-cdiar/dashboard-cdiar.component';
import { CargaHorariaDocenteComponent } from './carga-horaria-docente/pages/carga-horaria-docente/carga-horaria-docente.component';

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
        canActivate: [AuthGuard],
        canMatch: [AuthGuard],
        data: { roles: ['Admin','Estudiante','Docente'] },
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
      },
      {
        path:'academic-resources',
        component: ResourcesComponent,
        canActivate: [AuthGuard],
        canMatch: [AuthGuard],
        data: { roles: ['Estudiante','Docente'] },
        loadChildren: () => import('./academic-resources/academic-resources.module').then(m => m.AcademicResourcesModule),
      },
      {
        path:'control-security',
        canActivate: [AuthGuard],
        canMatch: [AuthGuard],
        data: { roles: ['Admin'] },
        loadChildren: () => import('./control/control.module').then(m => m.ControlModule),
      },
      {
        path:'carga-horaria',
        component: CargaHorariaDocenteComponent,
        canActivate: [AuthGuard],
        canMatch: [AuthGuard],
        data: { roles: ['Docente'] },
        loadChildren: () => import('./carga-horaria-docente/carga-horaria-docente.module').then(m => m.CargaHorariaDocenteModule),
      },
      {
        path:'learn',
        loadChildren: () => import('./learn/learn.module').then(m => m.LearnModule),
      },
      {
        path: 'simuladores',
        loadChildren: () => import('./simulators/simulators.module').then(m => m.SimulatorsModule),
      },
      {
        path:'metas-y-rendimiento',
        canActivate: [AuthGuard],
        canMatch: [AuthGuard],
        data: { roles: ['Estudiante'] },
        loadChildren: () => import('./metas-y-rendimiento/metas-y-rendimiento.module').then(m => m.MetasYRendimientoModule),
      },
      {
        path: 'reports',
        canActivate: [AuthGuard],
        canMatch: [AuthGuard],
        data: { roles: ['Admin'] },
        loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule),
        
      },
      {
        path:'dashboard',
        component: DashboardCdiarComponent,
        canActivate: [AuthGuard],
        canMatch: [AuthGuard],
        data: { roles: ['Admin'] },
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
      }
      
    ],
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
