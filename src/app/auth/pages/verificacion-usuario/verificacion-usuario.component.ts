import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EmailVerification } from '../../interfaces/email-verification';
import { AuthService } from '../../services/auth.service';
import { Email } from '../../interfaces/email';
import { encryptStorage } from '../../../shared/utils/storage';

@Component({
  selector: 'verificacion-usuario',
  templateUrl: './verificacion-usuario.component.html',
  styles: ``,
})
export class VerificacionUsuarioComponent {
  value: any;

  public userGroup = new FormGroup({
    email: new FormControl<string>(''),
    token: new FormControl<string>(''),
  });

  public emailGroup = new FormGroup({
    email: new FormControl<string>(''),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  get emailVerification(): EmailVerification {
    return this.userGroup.value as EmailVerification;
  }

  get email(): Email {
    return this.emailGroup.value as Email;
  }

  onSubmit() {
    if (this.userGroup.invalid) return;

    const user = encryptStorage.getItem('user');
    const userJson = JSON.parse(user);
    const email = userJson?.email || '';
    this.emailVerification.email = email;

    this.authService.verifyUser(this.emailVerification).subscribe((email) => {
      encryptStorage.removeItem('user');
      this.router.navigate(['/auth/login']);
    });
  }

  reenviarCorreo() {
    const user = encryptStorage.getItem('user');
    const userJson = JSON.parse(user);
    const email = userJson?.email || '';
    this.emailVerification.email = email;

    this.authService.resendVerificationMail(this.email).subscribe((email) => {
      this.router.navigate(['/auth/verify']);
    });
  }
}
