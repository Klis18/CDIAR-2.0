import { Injectable, inject } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { HelperHttpService } from '../../shared/services/helper.http.service';
import { Nivel } from '../interfaces/nivel.inteface';
import { Asignatura } from '../interfaces/asignatura.inteface';
import { Estado } from '../interfaces/estados.interface';
import {
  ListaRecurso,
  Recurso,
  RecursoEdit,
  RecursoResponse,
  RecursosGetQuery,
} from '../interfaces/recurso.interface';
import { Docente } from '../interfaces/docente.interface';

@Injectable({
  providedIn: 'root',
})

export class RecursoService {
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

  getEstados() {
    return this.http.get<Estado>('estados', {
      headers: this.headers,
    });
  }

  addRecurso(recurso: Recurso) {
    return this.http.post<Recurso>('recursos/crear', recurso, {
      headers: this.headers,
    });
  }

  getRecursos({
    page,
    limit,
    idAsignatura,
    idNivel,
    descripcion,
    idEstado,
    revisor,
  }: RecursosGetQuery) {
    if (!page) page = 1;
    if (!limit) limit = 5;
    let query: string = `?pages=${page}&limit=${limit}`;

    if (idAsignatura) query += `&idAsignatura=${idAsignatura}`;
    if (idNivel) query += `&idNivel=${idNivel}`;
    if (descripcion && descripcion !== '')
      query += `&descripcion=${descripcion}`;
    if (idEstado) query += `&idEstado=${idEstado}`;
    if (revisor) query += `&revisor=${revisor}`;
    return this.http.get<ListaRecurso>(`recursos/listarecursos${query}`, {
      headers: this.headers,
    });
  }

  getRecursosReviewed({
    page,
    limit,
    idAsignatura,
    idNivel,
    descripcion,
    idEstado,
    revisor,
  }: RecursosGetQuery) {
    if (!page) page = 1;
    if (!limit) limit = 5;
    let query: string = `?pages=${page}&limit=${limit}`;

    if (idAsignatura) query += `&idAsignatura=${idAsignatura}`;
    if (idNivel) query += `&idNivel=${idNivel}`;
    if (descripcion && descripcion !== '')
      query += `&descripcion=${descripcion}`;
    if (idEstado) query += `&idEstado=${idEstado}`;
    if (revisor) query += `&revisor=${revisor}`;
    return this.http.get<ListaRecurso>(
      `recursos/listarecursosrevisados${query}`,
      {
        headers: this.headers,
      }
    );
  }

  getRecurso(idRecurso: number) {
    return this.http.get<RecursoResponse>(`recursos/obtener/${idRecurso}`, {
      headers: this.headers,
    });
  }

  editarRecurso(recurso: RecursoEdit) {
    return this.http.put<RecursoEdit>('recursos/actualizar', recurso, {
      headers: this.headers,
    });
  }

  eliminarRecurso(idRecurso: number) {
    return this.http.delete(`recursos/eliminar/${idRecurso}`, {
      headers: this.headers,
    });
  }

  setRevisionResource(id: number) {
    return this.http.post(`recursos/revisado/${id}`, null, {
      headers: this.headers,
    });
  }

  getDocentesRevision() {
    return this.http.get<Docente>('docentesrevision', {
      headers: this.headers,
    });
  }
}
