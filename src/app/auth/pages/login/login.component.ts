import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormControl } from '@angular/forms';
import { Login } from '../../interfaces/login';
import { JsonResponse } from '../../../shared/interfaces/json-response';
import { CustomValidators } from '../../../../custom/custom-validators';
// import Swal from 'sweetalert2'

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
    private router: Router
  ) {}
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, CustomValidators.atLeastOneLowercase, CustomValidators.atLeastOneUppercase, CustomValidators.atLeastOneNumber, Validators.minLength(10)]],
    });
  }

  // value: number | undefined;

  // constructor(private router: Router) {}

  get loginSend(): Login {
    return this.loginForm.value as Login;
  }

  onSubmit() {
    console.log(this.loginForm.value);
    if (this.loginForm.invalid) {
      return;
    }

  this.authService.login(this.loginSend).subscribe((res: boolean) => {
    if (res) {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/auth/login']);
    }
  });
}
}
