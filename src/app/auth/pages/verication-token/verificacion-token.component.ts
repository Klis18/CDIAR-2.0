import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EmailVerification } from '../../interfaces/email-verification';
import { AuthService } from '../../services/auth.service';
import { Email } from '../../interfaces/email';
import { encryptStorage } from '../../../shared/utils/storage';
import { SpinnerService } from '../../../shared/services/spinner.service';

@Component({
  selector: 'verificacion-token',
  templateUrl: './verificacion-token.component.html',
  styles: ``,
})
export class VerificacionTokenComponent {
  value: any;

  public userGroup = new FormGroup({
    token: new FormControl<string>(''),
  });

  public emailGroup = new FormGroup({
    email: new FormControl<string>(''),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private spinnerService: SpinnerService,
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
    encryptStorage.setItem('token', this.emailVerification.token);
    this.router.navigate(['/auth/new-password']);
  }

  reenviarCorreo() {
    const emailUser = encryptStorage.getItem('email-user') || '';

    this.emailVerification.email = emailUser;
    this.spinnerService.showSpinner();

    this.authService
      .resendChangePasswordEmail(this.email)
      .subscribe((email) => {
        this.spinnerService.hideSpinner();

        this.router.navigate(['/auth/verify-token']);
      });
  }
}
