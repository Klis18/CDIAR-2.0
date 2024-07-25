import { Injectable, inject } from '@angular/core';
import { HelperHttpService } from '../../shared/services/helper.http.service';
import { HttpHeaders } from '@angular/common/http';
import { userDataGetQuery, usersData } from '../interfaces/users.interface';
import {
  SimuladoresData,
  SimuladoresGetQuery,
} from '../interfaces/simulator.interface';
import { VideoLearnsReport, videoLearnsReportGetQuery } from '../interfaces/videolearn.interface';

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

    return this.http.get<usersData>(`usuario/usuarios${query}`, {
      headers: this.headers,
    });
  }

  getDataSimuladores({
    page,
    limit,
    idAsignatura,
    idNivel,
    id,
    nombreSimulador,
    nombreEstudiante,
  }: SimuladoresGetQuery) {
    if (!page) page = 1;
    if (!limit) limit = 10;
    let query = `?page=${page}&limit=${limit}`;

    if (idAsignatura) query += `&idAsignatura=${idAsignatura}`;
    if (idNivel) query += `&idNivel=${idNivel}`;
    if (id) query += `&id=${id}`;
    if (nombreSimulador) query += `&nombreSimulador=${nombreSimulador}`;
    if (nombreEstudiante) query += `&nombreEstudiante=${nombreEstudiante}`;
    return this.http.get<SimuladoresData>(`simuladores/reporteSimuladores${query}`, {
      headers: this.headers,
    });
  }


  getDataVideoLearns({
    pages,
    limit,
    idAsignatura,
    idNivel,
    nombreVideoLearn,
    nombreEstudiante,
  }: videoLearnsReportGetQuery) {
    if (!pages) pages = 1;
    if (!limit) limit = 10;
    let query = `?page=${pages}&limit=${limit}`;

    if (idAsignatura) query += `&idAsignatura=${idAsignatura}`;
    if (idNivel) query += `&idNivel=${idNivel}`;
    if (nombreVideoLearn) query += `&nombreVideoLearn=${nombreVideoLearn}`;
    if (nombreEstudiante) query += `&nombreEstudiante=${nombreEstudiante}`;
    return this.http.get<VideoLearnsReport>(`videolearn/reporteVideoLearn${query}`, {
      headers: this.headers,
    });
  }
}
