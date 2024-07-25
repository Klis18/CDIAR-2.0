import { HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HelperHttpService } from '../../shared/services/helper.http.service';
import { cargaHoraria, cargaHorariaDocenteDia, diasSemana, addCargaHoraria, updateCargaHoraria, listaCargaHoraria, ListaCargaHorariaGetQuery, ListaCargaHorariaDocenteGetQuery } from '../interfaces/carga-horaria.interface';

@Injectable({
  providedIn: 'root'
})
export class CargaHorariaDocenteService {
  private http = inject(HelperHttpService);

  private headers = new HttpHeaders().set(
    'Authorization',
    `Bearer ${localStorage.getItem('token')}`
  );


  getDiasSemana() {
    return this.http.get<diasSemana>('diassemana', {
      headers: this.headers,
    });
  }

  listarCargaHorariaDocente({
    diaSemana,
    actividad,
    pages,
    limit,
  }: ListaCargaHorariaDocenteGetQuery) {

    if (!pages) pages = 1;
    if (!limit) limit = 5;
    let query: string = `?pages=${pages}&limit=${limit}`;

    if (diaSemana) query += `&diaSemana=${diaSemana}`;
    if (actividad && actividad !== '')
      query += `&actividad=${actividad}`;

    return this.http.get<cargaHorariaDocenteDia>(`cargaHorariaDocente${query}`, {
      headers: this.headers,
    });
  }

  getCargaHorariaDocente(id: number) {
    return this.http.get<cargaHorariaDocenteDia>(`cargaHoraria/${id}`, {
      headers: this.headers,
    });
  }

  addCargaHoraria(payload: { cargaHoraria: addCargaHoraria[]}) {
    return this.http.post('cargaHoraria/crear',payload, {
      headers: this.headers,
    });
  }

  updateCargaHoraria(cargaHoraria: updateCargaHoraria) {
    return this.http.put<updateCargaHoraria>(`cargaHoraria/actualizar`, cargaHoraria, {
      headers: this.headers,
    });
  }

  deleteCargaHoraria(id: number) {
    return this.http.delete(`cargaHoraria/eliminar/${id}`, {
      headers: this.headers,
    });
  }

  listaCargaHorariaDiasSemana(id:number){
    return this.http.get<listaCargaHoraria>(`cargaHoraria/${id}`, {
      headers: this.headers,
    });
  }


  listaCargaHorariaTabla(idDocente: string,{
    
    diaSemana,
    actividad,
    pages,
    limit,
  }: ListaCargaHorariaDocenteGetQuery) {
    if (!pages) pages = 1;
    if (!limit) limit = 5;
    let query: string = `?pages=${pages}&limit=${limit}`;

    if (diaSemana) query += `&diaSemana=${diaSemana}`;
    if (actividad && actividad !== '')
      query += `&actividad=${actividad}`;

    return this.http.get<listaCargaHoraria>(`cargaHorariaTabla/${idDocente}${query}`, {
      headers: this.headers,
    });
  }
}
