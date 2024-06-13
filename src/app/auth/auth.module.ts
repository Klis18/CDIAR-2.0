import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { RegistroUsuarioComponent } from './pages/registro-usuario/registro-usuario.component';
import { VerificacionUsuarioComponent } from './pages/verificacion-usuario/verificacion-usuario.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { SharedModule } from '../shared/shared.module';
import { DataRequiredMessageComponent } from './components/data-required-message/data-required-message.component';
import { RecoveryEmailComponent } from './pages/recovery-email/recovery-email.component';
import { RecoveryPasswordComponent } from './pages/recovery-password/recovery-password.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import { VerificacionTokenComponent } from './pages/verication-token/verificacion-token.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegistroUsuarioComponent,
    VerificacionUsuarioComponent,
    AuthLayoutComponent,
    DataRequiredMessageComponent,
    RecoveryEmailComponent,
    RecoveryPasswordComponent,
    VerificacionTokenComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    NgxCaptchaModule,
  ],
  exports: [
    RegistroUsuarioComponent,
    LoginComponent,
    VerificacionUsuarioComponent,
  ],
})
export class AuthModule {}
