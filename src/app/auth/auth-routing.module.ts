import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistroUsuarioComponent } from './pages/registro-usuario/registro-usuario.component';
import { VerificacionUsuarioComponent } from './pages/verificacion-usuario/verificacion-usuario.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { RecoveryEmailComponent } from './pages/recovery-email/recovery-email.component';
import { RecoveryPasswordComponent } from './pages/recovery-password/recovery-password.component';
import { VerificacionTokenComponent } from './pages/verication-token/verificacion-token.component';

const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'registro', component: RegistroUsuarioComponent },
      { path: 'verify', component: VerificacionUsuarioComponent },
      { path: 'recovery', component: RecoveryEmailComponent },
      { path: 'new-password', component: RecoveryPasswordComponent },
      { path: 'verify-token', component: VerificacionTokenComponent },
      { path: '**', redirectTo: 'login' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
