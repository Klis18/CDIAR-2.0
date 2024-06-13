import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HomeService } from '../../services/home.service';
import { PersonalData } from '../../interfaces/personalData';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: [],
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  changePasswordForm!: FormGroup;
  isDisabled: boolean = true;
  userName: string = '';
  rolName: string = '';
  profilePhoto: string = '';
  photoBase64: string | null = null;
  previewPhoto: any = null;

  constructor(private homeService: HomeService) {}

  ngOnInit() {
    this.profileForm = new FormGroup({
      cedula: new FormControl('', [
        Validators.required,
        Validators.pattern('.{10}$'),
      ]),
      nombres: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z\\s]*$'),
      ]),
      apellidos: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z\\s]*$'),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phoneNumber: new FormControl('', [
        Validators.required,
        Validators.pattern('.{10}$'),
      ]),
    });

    this.homeService.obtenerDatosMenu().subscribe((user) => {
      this.userName = user.data.userName;
      this.rolName = user.data.rol;
      this.profilePhoto = user.data.foto;
    });

    this.homeService.obtenerDatosUsuario().subscribe((user) => {
      this.profilePhoto = user.data.foto || '';
      console.log('User:', user); // Depuración
      this.profileForm.setValue({
        cedula: user.data.cedula,
        nombres: user.data.nombres,
        apellidos: user.data.apellidos,
        email: user.data.email,
        phoneNumber: user.data.phoneNumber,
      });
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.previewPhoto = reader.result;
        this.photoBase64 = (reader.result as string).split(',')[1];
      };
    }
  }

  onSubmit() {
    if (this.profileForm.invalid) return;

    if (this.photoBase64 === null) {
      this.photoBase64 = null;
    }

    const userData: PersonalData = {
      ...this.profileForm.value,
      username: (
        this.profileForm.value.nombres + this.profileForm.value.apellidos
      ).replace(/\s/g, ''),
      foto: this.photoBase64,
    };

    console.log('User Data:', userData); // Depuración

    this.homeService.actualizarDatosUsuario(userData).subscribe(
      (response) => {
        // manejar la respuesta exitosa
        console.log('Response:', response);
        this.isDisabled = true;
      },
      (error) => {
        // manejar el error
        console.error('Error:', error);
      }
    );
  }

  editar() {
    this.isDisabled = !this.isDisabled;
  }

  cancelar() {
    this.isDisabled = true;
  }
}
