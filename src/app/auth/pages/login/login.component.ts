import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router} from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Login } from '../../interfaces/login';
import { CustomValidators } from '../../../../custom/custom-validators';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { SpinnerService } from '../../../shared/services/spinner.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styles: `
            img{
              width:40%;
            }
          `,
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  showPassword = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private spinnerService: SpinnerService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  get loginSend(): Login {
    return this.loginForm.value as Login;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    this.spinnerService.showSpinner();

  this.authService.login(this.loginSend).subscribe((res: boolean) => {
    if (res) {
      this.spinnerService.hideSpinner();
      this.router.navigate(['/home']);
    } else {
      this.spinnerService.hideSpinner();
      this.router.navigate(['/auth/login']);
    }
  });
}

togglePasswordVisibility(): void {
  this.showPassword = !this.showPassword;
}
}
