import { Component, OnInit } from '@angular/core';
import { changePassword } from '../../../auth/interfaces/change-password';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HomeService } from '../../services/home.service';

@Component({
  selector: 'change-password',
  templateUrl: './change-password.component.html',
  styles: ``
})
export class ChangePasswordComponent implements OnInit{

  isDisabled: boolean = true;
  
  changePasswordForm!: FormGroup;
  ngOnInit(){
    this.changePasswordForm = new FormGroup({
      oldPassword: new FormControl('', Validators.required),
      newPassword: new FormControl('', Validators.required),
    });
  }

  
  constructor(private homeService: HomeService) {}

  onSubmit() {

    if(this.changePasswordForm.invalid) return;

    const userData: changePassword = {
      ...this.changePasswordForm.value,
    };

    this.homeService.cambiarContrasena(userData).subscribe(
      (response) => {
        // manejar la respuesta exitosa
        console.log('Response:', response);
      },
      (error) => {
        // manejar el error
        console.error('Error:', error);
      }
    )
  }
  edit(){
    this.isDisabled = !this.isDisabled;
  }
  cancelar(){
    this.isDisabled = true;
  }

}
