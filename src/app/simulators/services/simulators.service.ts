import { HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { HelperHttpService } from '../../shared/services/helper.http.service';
import { ListSimulatorSaver, ListSimulators, NewSimulator, NewSimulatorQuestion, QuestionsSimulatorsGetQuery, Simulator, SimulatorSaversGetQuery, SimulatorsGetQuery, SimulatorsQuestions, TipoPreguntas, UpdateSimulator, UpdateSimulatorQuestion, observationSimulator, sendObservationSimulator, updateStatusSimulator } from '../interfaces/simulators.interface';
import { Asignatura } from '../../academic-resources/interfaces/asignatura.inteface';
import { Docente } from '../../academic-resources/interfaces/docente.interface';
import { Estado } from '../../academic-resources/interfaces/estados.interface';
import { Nivel } from '../../academic-resources/interfaces/nivel.inteface';
import { sendObservation } from '../../learn/interfaces/mazo.interface';

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

  getTiposPreguntas() {
    return this.http.get<TipoPreguntas>('simuladores/tipospreguntas', {
      headers: this.headers,
    });
  }


  //----------SIMULADORES----------------


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

  updateSimulator(simulador:UpdateSimulator){
    return this.http.put<UpdateSimulator>('simuladores/actualizar',simulador, {
      headers: this.headers,
    });
  }

  deleteSimulator(idSimulador:number){
    return this.http.delete(`simuladores/eliminarSimulador/${idSimulador}`, {
      headers: this.headers,
    });
  }

  actualizarEstadoSimulator(simulator:updateStatusSimulator){
    return this.http.post('simuladores/publicarSimulador', simulator, {
      headers: this.headers,
    });
  }

  sendObservationSimulator(observacion: sendObservationSimulator){
    return this.http.post('simuladores/observacionesSimulador', observacion, {
      headers: this.headers,
    });

  }

  getObservationSimulator(idSimulador: number){
    return this.http.get<observationSimulator>(`simuladores/visualizarObservacionesSimulador/${idSimulador}`, {
      headers: this.headers,
    });
  }

  SaveSimulatorToReview(idSimulador:number){
    return this.http.post(`simuladores/guardarSimulador/${idSimulador}`, {}, {
      headers: this.headers,
    });
  }

  getSimulatorSaver(){
    return this.http.get<ListSimulators>('simuladores/obtenerSimuladoresGuardados', {
      headers: this.headers,
    });
  }

  getSimulatorsSavers({
    page,
    limit,
    idAsignatura,
    idNivel,
    nombreSimulador,
  }: SimulatorSaversGetQuery) {
    if (!page) page = 1;
    if (!limit) limit = 5;
    let query: string = `?pages=${page}&limit=${limit}`;

    if (idAsignatura) query += `&idAsignatura=${idAsignatura}`;
    if (idNivel) query += `&idNivel=${idNivel}`;
    if (nombreSimulador && nombreSimulador !== '')
      query += `&nombreSimulador=${nombreSimulador}`;

    return this.http.get<ListSimulatorSaver>(`simuladores/obtenerSimuladoresGuardados${query}`, {
      headers: this.headers,
    });
  }

  startSimulator(idSimulador:number){
    return this.http.get<SimulatorsQuestions[]>(`simuladores/realizarSimulador/${idSimulador}`, {
      headers: this.headers,
    });
  }
  //----------PREGUNTAS SIMULADORES----------------

  getPreguntasSimulador({ idSimulador, page, limit, pregunta}: QuestionsSimulatorsGetQuery) {
    if (!page) page = 1;

    if (!limit) limit = 5;

    let query: string = `?idSimulador=${idSimulador}&pages=${page}&limit=${limit}`;
    if (pregunta && pregunta !== '')
      query += `&pregunta=${pregunta}`;

    return this.http.get<SimulatorsQuestions>(`simuladores/obtenerPreguntasRespuestaSimulador${query}`, {
      headers: this.headers,
    });
  }

  getSimulatorQuestion(idPregunta: number) {
    return this.http.get<UpdateSimulatorQuestion>(`simuladores/obtenerPregunta/${idPregunta}`, {
      headers: this.headers,
    });
  }
  

  addSimulatorQuestion(simulatorQuestion: NewSimulatorQuestion) {
    return this.http.post('simuladores/crearpreguntas', simulatorQuestion, {
      headers: this.headers
    });
  }

  updateSimulatorQuestion(simulatorQuestion: UpdateSimulatorQuestion) {
    return this.http.put('simuladores/actualizarPregunta', simulatorQuestion, {
      headers: this.headers
    });
  }

  deleteSimulatorQuestion(idPregunta: number) {
    return this.http.delete(`simuladores/eliminarPregunta/${idPregunta}`, {
      headers: this.headers
    });
  }
  
}
