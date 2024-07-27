import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Email } from '../../interfaces/email';
import { EmailVerification } from '../../interfaces/email-verification';
import { AuthService } from '../../services/auth.service';
import { encryptStorage } from '../../../shared/utils/storage';
import { SpinnerService } from '../../../shared/services/spinner.service';

@Component({
  selector: 'app-recovery-email',
  templateUrl: './recovery-email.component.html',
  styles: ``,
})
export class RecoveryEmailComponent {
  value: any;

  public emailGroup = new FormGroup({
    email: new FormControl<string>(''),
  });

  constructor(private authService: AuthService, private router: Router, private spinnerService: SpinnerService,
  ) {}

  get email(): Email {
    return this.emailGroup.value as Email;
  }

  onSubmit() {
    if (this.emailGroup.invalid) return;

    encryptStorage.setItem('user-email', JSON.stringify(this.email));
    this.spinnerService.showSpinner();

    this.authService.forgotPassword(this.email).subscribe((email) => {
      this.spinnerService.hideSpinner();

      this.router.navigate(['/auth/verify-token']);
    });
  }

  reenviarCorreo() {
    if (this.emailGroup.invalid) return;

    this.authService
      .resendChangePasswordEmail(this.email)
      .subscribe((email) => {
        encryptStorage.setItem('email-user', JSON.stringify(email));
        this.router.navigate(['/auth/verify-token']);
      });
  }
}
