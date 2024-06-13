import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Email } from '../../interfaces/email';
import { AuthService } from '../../services/auth.service';
import { encryptStorage } from '../../../shared/utils/storage';
import { ForgotPassword } from '../../interfaces/forgot-password';

@Component({
  selector: 'app-recovery-password',
  templateUrl: './recovery-password.component.html',
  styles: ``,
})
export class RecoveryPasswordComponent {
  value: any;
  siteKey: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.siteKey = '6Ld5KuQpAAAAAEY05mmbzmOX0lO9teZ8VAlyUUOO';
  }

  public userGroup = new FormGroup({
    newPassword: new FormControl<string>(''),
  });

  get ForgotPassword(): ForgotPassword {
    return this.userGroup.value as ForgotPassword;
  }

  onSubmit() {
    if (this.userGroup.invalid) return;

    const userEmail = encryptStorage.getItem('user-email');
    const email = JSON.parse(userEmail);
    this.ForgotPassword.email = email.email;

    const token = encryptStorage.getItem('token');
    this.ForgotPassword.token = token;

    this.authService.resetpassword(this.ForgotPassword).subscribe((email) => {
      encryptStorage.removeItem('user-email');
      encryptStorage.removeItem('token');
      this.router.navigate(['/auth/login']);
    });
  }
}
