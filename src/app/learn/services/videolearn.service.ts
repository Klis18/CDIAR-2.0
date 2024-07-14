import { HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HelperHttpService } from '../../shared/services/helper.http.service';
import { addQuestionsVideolearn, addVideolearn, asignarRevisorVideolearn, editQuestionsVideolearn, editVideoLearn, GetQuestionsQuery, ListVideolearn, obtenerPreguntasRespuestas, videoLearnsGetQuery, sendObservationVideolearn, updateStatusVideolearn, videoYtb } from '../interfaces/videolearn.interface';

@Injectable({
  providedIn: 'root'
})
export class VideolearnService {

  private nombreMazoSource = new BehaviorSubject<string>('nombre inicial');
  nombreMazoActual = this.nombreMazoSource.asObservable();
  
  private http = inject(HelperHttpService);

  private headers = new HttpHeaders().set(
    'Authorization',
    `Bearer ${localStorage.getItem('token')}`
  );
  constructor() { }

  validateLinkYoutube(link: string){
    return this.http.post('yt',link, {
      headers: this.headers,
    });
  }

  addVideolearn(videolearn: addVideolearn){
    return this.http.post<addVideolearn>('videolearn/crear',videolearn, {
      headers: this.headers,
    });

  }

  updateVideolearn(videolearn: editVideoLearn){
    return this.http.put<editVideoLearn>('videolearn/editar',videolearn, {
      headers: this.headers,
    });
  }

  addVideolearnQuestions(videolearn: addQuestionsVideolearn){
    return this.http.post('videolearn/crearPreguntas',videolearn, {
      headers: this.headers,
    });
  }

  updateVideolearnQuestions(videolearn: editQuestionsVideolearn){
    return this.http.put('videolearn/actualizarPregunta',videolearn, {
      headers: this.headers,
    });
  }

  getVideolearns({
    pages,
    limit,
    idAsignatura,
    idNivel,
    nombreSimulador,
    idEstado,
    nombreDocenteRevisor,
    usuarioCreador,
  }: videoLearnsGetQuery) {
    if (!pages) pages = 1;
    if (!limit) limit = 5;
    let query: string = `?pages=${pages}&limit=${limit}`;

    if (idAsignatura) query += `&idAsignatura=${idAsignatura}`;
    if (idNivel) query += `&idNivel=${idNivel}`;
    if (nombreSimulador && nombreSimulador !== '')
      query += `&nombreSimulador=${nombreSimulador}`;
    if (idEstado) query += `&idEstado=${idEstado}`;
    if (nombreDocenteRevisor && nombreDocenteRevisor !== '')
      query += `&nombreDocenteRevisor=${nombreDocenteRevisor}`;
    if (usuarioCreador && usuarioCreador === true)
      query += `&usuarioCreador=${usuarioCreador}`;

    return this.http.get<ListVideolearn>(`videolearn${query}`, {
      headers: this.headers,
    });
  }

  getQuestionsVideolearn({
    pages,
    limit,
    idVideoLearn,
    pregunta
  }: GetQuestionsQuery) {
    if (!pages) pages = 1;
    if (!limit) limit = 5;
    let query: string = `?pages=${pages}&limit=${limit}`;

    if (idVideoLearn) query += `&idVideoLearn=${idVideoLearn}`;
    
    if (pregunta && pregunta !== '')
      query += `&pregunta=${pregunta}`;
   

    return this.http.get<obtenerPreguntasRespuestas>(`videolearn/obtenerPreguntasRespuestaVideoLearn${query}`, {
      headers: this.headers,
    });
  }

  getQuestion(idVideoLearn: number){
    return this.http.get(`videolearn/obtenerPregunta/${idVideoLearn}`, {
      headers: this.headers,
    });
  }

  getVideoLearn(idVideoLearn: number){
    return this.http.get(`videolearn/${idVideoLearn}`, {
      headers: this.headers,
    });
  }

  deleteQuestionVideolearn(idVideoLearn: number){
    return this.http.delete(`videolearn/eliminarPregunta/${idVideoLearn}`, {
      headers: this.headers,
    });
  }

  deleteVideolearn(idVideoLearn: number){
    return this.http.delete(`videolearn/eliminarVideoLearn/${idVideoLearn}`, {
      headers: this.headers,
    });
  }

  assignRevisor(revisor: asignarRevisorVideolearn){
    return this.http.post('videolearn/asignarRevisor', revisor,{
      headers: this.headers,
    });
  }

  viewObservation(idVideoLearn: number){
    return this.http.get(`videolearn/visualizarObservacionesVideoLear${idVideoLearn}`, {
      headers: this.headers,
    });
  }

  sendObservationVideolearn(videolearn: sendObservationVideolearn){
    return this.http.post('videolearn/obsrevaciones',videolearn, {
      headers: this.headers,
    });
  }

  changeStatusVideolearn(idVideoLearn: updateStatusVideolearn){
    return this.http.post('videolearn/publicar',idVideoLearn, {
      headers: this.headers,
    });
  }

  verifyYtbVideoDuration(video: videoYtb){
    return this.http.post('yt', video,{
      headers: this.headers,
    });
  }
}
