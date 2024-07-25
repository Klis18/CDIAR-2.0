import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router} from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Login } from '../../interfaces/login';
import { CustomValidators } from '../../../../custom/custom-validators';
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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private spinnerService: SpinnerService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, CustomValidators.atLeastOneLowercase, CustomValidators.atLeastOneUppercase, CustomValidators.atLeastOneNumber, Validators.minLength(10)]],
    });
  }

  get loginSend(): Login {
    return this.loginForm.value as Login;
  }

  onSubmit() {
    console.log(this.loginForm.value);
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
}
