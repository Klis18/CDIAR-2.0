import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../interfaces';
import { Role } from '../../interfaces/role';
import { AuthService } from '../../services/auth.service';
import { CustomValidators } from '../../../../custom/custom-validators';
import { encryptStorage } from '../../../shared/utils/storage';
import { SpinnerService } from '../../../shared/services/spinner.service';

@Component({
  selector: 'registro-usuario',
  templateUrl: './registro-usuario.component.html',
  styles: ``,
})
export class RegistroUsuarioComponent {
  value: string | undefined;
  siteKey: string;
  // userTypes: any;

  userTypes: { label: string; value: string }[] = [];
  userTypes2: { label: string; value: string }[] = [];

  // formGroup: FormGroup = new FormGroup({});

  public userGroup = new FormGroup(
    {
      cedula: new FormControl<string>('', Validators.required),
      nombres: new FormControl<string>('', Validators.required),
      apellidos: new FormControl<string>('', Validators.required),
      email: new FormControl<string>('', Validators.required),
      phoneNumber: new FormControl<string>('', Validators.required),
      password: new FormControl<string>('', Validators.required),
      passwordConfirm: new FormControl<string>('', Validators.required),
      rolId: new FormControl<string>('', Validators.required),
    },
    {
      validators: CustomValidators.mustBeEqual('password', 'passwordConfirm'),
    }
  );

  ngOnInit() {
    this.authService.obtenerRoles().subscribe((res: any) => {
      this.userTypes = res.data.map((role: Role) => ({
        label: role.rolName,
        value: role.rolId,
      }));
      this.userTypes2 = this.userTypes.filter(item => item !== this.userTypes[0]);
      
    });
  }

  constructor(private authService: AuthService, private router: Router, private spinnerService: SpinnerService,
  ) {
    // this.siteKey = '6Ld5KuQpAAAAAEY05mmbzmOX0lO9teZ8VAlyUUOO';
    this.siteKey = '6Lf5tBsqAAAAADaF6Z4ymd4CTRNy387FgE5IjWZj';
  }

  get currentUser(): User {
    const user = this.userGroup.value as User;
    return user;
  }

  onSubmit() {
    if (this.userGroup.invalid) return;

    this.currentUser.username = (
      this.currentUser.nombres + this.currentUser.apellidos
    ).replace(/\s/g, '');
    this.spinnerService.showSpinner();


    this.authService.registrarUsuario(this.currentUser).subscribe((user) => {
      this.spinnerService.hideSpinner();
      encryptStorage.setItem('user', this.currentUser);
      this.router.navigate(['/auth/verify']);
    });
  }
}
