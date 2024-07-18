import { Injectable, inject } from '@angular/core';
import { HelperHttpService } from '../../shared/services/helper.http.service';
import { HttpHeaders } from '@angular/common/http';
import { userDataGetQuery, usersData } from '../interfaces/users.interface';
import {
  SimuladoresData,
  SimuladoresGetQuery,
} from '../interfaces/simulator.interface';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private http = inject(HelperHttpService);

  private headers = new HttpHeaders().set(
    'Authorization',
    `Bearer ${localStorage.getItem('token')}`
  );
  constructor() {}

  getDataUsuarios({ page, limit, nombresCompletos }: userDataGetQuery) {
    if (!page) page = 1;

    if (!limit) limit = 5;

    let query: string = `?pages=${page}&limit=${limit}`;
    if (nombresCompletos && nombresCompletos !== '')
      query += `&nombresCompletos=${nombresCompletos}`;

    return this.http.get<usersData>('usuario/usuarios', {
      headers: this.headers,
    });
  }

  getDataSimuladores({
    page,
    limit,
    idAsignatura,
    idNivel,
    id,
  }: SimuladoresGetQuery) {
    if (!page) page = 1;
    if (!limit) limit = 10;
    let query = `?pages=${page}&limit=${limit}`;

    if (idAsignatura) query += `&idAsignatura=${idAsignatura}`;
    if (idNivel) query += `&idNivel=${idNivel}`;
    if (id) query += `&id=${id}`;
    return this.http.get<SimuladoresData>('simuladores/reporteSimuladores', {
      headers: this.headers,
    });
  }
}
