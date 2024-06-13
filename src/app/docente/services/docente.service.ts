import { Injectable, inject } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../auth/services/auth.service';
import { DiasSemana } from '../interfaces/dias-semana.interface';
import { HelperHttpService } from '../../shared/services/helper.http.service';
import { CargaHoraria } from '../interfaces/cargaHoraria.interface';

@Injectable({
  providedIn: 'root',
})
export class DocenteService {
  private http = inject(HelperHttpService);
  private headers = new HttpHeaders().set(
    'Authorization',
    `Bearer ${localStorage.getItem('token')}`
  );

  constructor(private authService: AuthService) {
    this.authService.checkAuthStatus().subscribe();
  }

  getDiasSemana() {
    return this.http.get<DiasSemana>('diassemana', {
      headers: this.headers,
    });
  }

  createCargaHoraria(payload: { cargaHoraria: CargaHoraria[] }) {
    return this.http.post('cargaHoraria/crear', payload, {
      headers: this.headers,
    });
  }

  listaCargaHoraria(){
    return this.http.get('cargaHoraria', {
      headers: this.headers,
    });
  }
}
