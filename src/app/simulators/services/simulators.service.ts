import { HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { HelperHttpService } from '../../shared/services/helper.http.service';
import { ListSimulators, NewSimulator, NewSimulatorQuestion, Simulator, SimulatorsGetQuery } from '../interfaces/simulators.interface';
import { Asignatura } from '../../academic-resources/interfaces/asignatura.inteface';
import { Docente } from '../../academic-resources/interfaces/docente.interface';
import { Estado } from '../../academic-resources/interfaces/estados.interface';
import { Nivel } from '../../academic-resources/interfaces/nivel.inteface';

@Injectable({
  providedIn: 'root'
})
export class SimulatorsService {

  private http = inject(HelperHttpService);

  private headers = new HttpHeaders().set(
    'Authorization',
    `Bearer ${localStorage.getItem('token')}`
  );
  constructor() { }

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

  getDocentes() {
    return this.http.get<Docente>('docentes', {
      headers: this.headers,
    });
  }


  getSimulators({
    page,
    limit,
    idAsignatura,
    idNivel,
    nombreSimulador,
    idEstado,
    nombreDocenteRevisor,
    usuarioCreador,
  }: SimulatorsGetQuery) {
    if (!page) page = 1;
    if (!limit) limit = 5;
    let query: string = `?pages=${page}&limit=${limit}`;

    if (idAsignatura) query += `&idAsignatura=${idAsignatura}`;
    if (idNivel) query += `&idNivel=${idNivel}`;
    if (nombreSimulador && nombreSimulador !== '')
      query += `&nombreSimulador=${nombreSimulador}`;
    if (idEstado) query += `&idEstado=${idEstado}`;
    if (nombreDocenteRevisor && nombreDocenteRevisor !== '')
      query += `&nombreDocenteRevisor=${nombreDocenteRevisor}`;
    if (usuarioCreador && usuarioCreador === true)
      query += `&usuarioCreador=${usuarioCreador}`;

    return this.http.get<ListSimulators>(`simuladores${query}`, {
      headers: this.headers,
    });
  }

  getDatosSimulator(idSimulador: number) {
    return this.http.get<Simulator>(`simuladores/${idSimulador}`, {
      headers: this.headers,
    });
  }

  addSimulator(simulador:NewSimulator){
    return this.http.post<NewSimulator>('simuladores/crear',simulador, {
      headers: this.headers,
    });
  }

  addSimulatorQuestion(simulatorQuestion: NewSimulatorQuestion) {
    return this.http.post('simuladores/crearpreguntas', simulatorQuestion, {
      headers: this.headers
    });
  }

}
