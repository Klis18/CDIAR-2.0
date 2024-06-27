import { Injectable, inject } from '@angular/core';
import { HelperHttpService } from '../../shared/services/helper.http.service';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../auth/services/auth.service';
import {
  ListaDocentes,
  ListaDocentesPorAprobar,
} from '../interfaces/lista-docentes.interface';
import { DocenteAprobacion } from '../interfaces/docente-aprobacion.interface';
import { AsignaDocenteRevisor, AsignaDocenteRevisorRecurso, ListaDocenteRevisor, RevisorGetQuery } from '../interfaces/asignDocente.interface';
import { Docente } from '../../academic-resources/interfaces/docente.interface';


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

  asignarRevisorMazo(revisor: AsignaDocenteRevisor) {
    return this.http.post<AsignaDocenteRevisor>('mazos/asignarrevisor',revisor, {
      headers: this.headers,
    });
  }


  getDocentesRevision() {
    return this.http.get<Docente>('docentesrevision', {
      headers: this.headers,
    });
  }

  asignarRevisorRecurso(revisor: AsignaDocenteRevisorRecurso) {
    return this.http.post<AsignaDocenteRevisorRecurso>('recursos/asignarrevisor',revisor, {
      headers: this.headers,
    });
  }


  getDocRevisores({
    page,
    limit,
    nombre
  }: RevisorGetQuery) {
    if (!page) page = 1;
    if (!limit) limit = 5;
    let query: string = `?pages=${page}&limit=${limit}`;
  
  
    if (nombre && nombre !== '')
      query += `&nombre=${nombre}`;
    
    return this.http.get<ListaDocenteRevisor>(`docentesrevision${query}`, {
      headers: this.headers,
    });
  }
}



