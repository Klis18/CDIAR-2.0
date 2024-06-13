import { Injectable, inject } from '@angular/core';
import { HelperHttpService } from '../../shared/services/helper.http.service';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../auth/services/auth.service';
import {
  ListaDocentes,
  ListaDocentesPorAprobar,
} from '../interfaces/lista-docentes.interface';
import { DocenteAprobacion } from '../interfaces/docente-aprobacion.interface';


@Injectable({
  providedIn: 'root',
})

export class SecurityService {

  private http = inject(HelperHttpService);
  private headers = new HttpHeaders().set(
    'Authorization',
    `Bearer ${localStorage.getItem('token')}`
  );

  constructor(private authService: AuthService) {
    this.authService.checkAuthStatus().subscribe();
  }

  getListaDocenteAprobar() {
    return this.http.get<ListaDocentesPorAprobar>(
      'admin/listaDocentesPorAprobar',
      {
        headers: this.headers,
      }
    );
  }

  aprobarDocente(docente: DocenteAprobacion) {
    return this.http.post<DocenteAprobacion>('admin/aprobarDocente', docente, {
      headers: this.headers,
    });
  }

  getListaDocentes() {
    return this.http.get<ListaDocentes>('admin/listaDocentes', {
      headers: this.headers,
    });
  }
}
