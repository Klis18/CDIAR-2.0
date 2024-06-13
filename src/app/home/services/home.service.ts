import { Injectable, inject } from '@angular/core';
import { HelperHttpService } from '../../shared/services/helper.http.service';
import { AuthService } from '../../auth/services/auth.service';
import { Home } from '../interfaces/home';
import { HttpHeaders } from '@angular/common/http';
import { User } from '../../auth/interfaces';
import { PersonalData } from '../interfaces/personalData';
import { changePassword } from '../../auth/interfaces/change-password';
@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private http = inject(HelperHttpService);
  private headers = new HttpHeaders().set(
    'Authorization',
    `Bearer ${localStorage.getItem('token')}`
  );

  constructor(authService: AuthService) {
    authService.checkAuthStatus().subscribe();
  }

  obtenerDatosMenu() {
    return this.http.get<Home>('persona/datos-persona-menu', {
      headers: this.headers,
    });
  }

  obtenerDatosUsuario() {
    return this.http.get<User>('usuario/infousuario', {
      headers: this.headers,
    });
  }

  actualizarDatosUsuario(data: PersonalData) {
    return this.http.put<PersonalData>('usuario/actualizar', data, {
      headers: this.headers,
    });
  }

  cambiarContrasena(data: changePassword) {
    return this.http.post('login/changepassword', data, {
      headers: this.headers,
    });
  }
}
