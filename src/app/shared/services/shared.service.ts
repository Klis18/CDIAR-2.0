import { HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Nivel } from '../interfaces/nivel.interface';
import { Asignatura } from '../interfaces/asignatura.interface';
import { HelperHttpService } from './helper.http.service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

  private http = inject(HelperHttpService);

  private headers = new HttpHeaders().set(
    'Authorization',
    `Bearer ${localStorage.getItem('token')}`
  );

  getNiveles() {
    return this.http.get<Nivel>('niveles', {
      headers: this.headers,
    });
  }

  getAsignaturasPorNivel(idNivel: number) {
    return this.http.get<Asignatura>(`asignatura/${idNivel}`, {
      headers: this.headers,
    });
  }
}
