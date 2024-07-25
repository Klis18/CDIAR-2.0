import { HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { HelperHttpService } from '../../shared/services/helper.http.service';
import { SimuladoresData } from '../../reports/interfaces/simulator.interface';
import { usersData } from '../../reports/interfaces/users.interface';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private http = inject(HelperHttpService);
  private headers = new HttpHeaders().set(
    'Authorization',
    `Bearer ${localStorage.getItem('token')}`
  );

  constructor(private authService: AuthService) {
    this.authService.checkAuthStatus().subscribe();
  }


  obtenerListadoSimuladoresRealizados(){
    return this.http.get<SimuladoresData>('simuladores/reporteSimuladores', {
      headers: this.headers,
    });
  }

  obtenerUsuarios(){
    this.http.get<usersData>('usuario/usuarios', {
      headers: this.headers,
    });
  }

}
