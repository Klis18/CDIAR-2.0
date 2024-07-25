import { HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HelperHttpService } from '../../shared/services/helper.http.service';
import { addMeta, getMeta, listadoMetas, listadoMetasGetQuerys, updateMeta } from '../interfaces/metas.interface';

@Injectable({
  providedIn: 'root'
})
export class MetasYRendimientoService {
  private http = inject(HelperHttpService);

  private headers = new HttpHeaders().set(
    'Authorization',
    `Bearer ${localStorage.getItem('token')}`
  );

  addMeta(meta: addMeta) {
    return this.http.post('metas/crearMeta', meta, {
      headers: this.headers,
    });
  }

  editMeta(meta: updateMeta) {
    return this.http.put('metas/editarMeta', meta, {
      headers: this.headers,
    });
  }

  listMetas({
    pages,
    limit,
    idNivel,
    idAsignatura
  }:listadoMetasGetQuerys){
    if (!pages) pages = 1;
    if (!limit) limit = 5;
    let query: string = `?pages=${pages}&limit=${limit}`;

    if (idNivel) query += `&idNivel=${idNivel}`;
    if (idAsignatura) query += `&idAsignatura=${idAsignatura}`;

    return this.http.get<listadoMetas>(`metas${query}`, {
      headers: this.headers,
    });
  }
  
  getMeta(idMeta: number) {
    return this.http.get<getMeta>(`metas/${idMeta}`, {
      headers: this.headers,
    });
  }

  deleteMeta(idMeta: number) {
    return this.http.delete(`metas/eliminarMeta/${idMeta}`, {
      headers: this.headers,
    });
  }
}
