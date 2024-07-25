import { HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HelperHttpService } from '../../shared/services/helper.http.service';
import { addQuestionsVideolearn, addVideolearn, asignarRevisorVideolearn, editQuestionsVideolearn, editVideoLearn, GetQuestionsQuery, ListVideolearn, obtenerPreguntasRespuestas, videoLearnsGetQuery, sendObservationVideolearn, updateStatusVideolearn, videoYtb, getVideolearn, verObservacionesVideolearn, ListVideoLearnSaved, videoLearnsRealizedGetQuerys, calificacionVideolearn, videoLearnsRealized } from '../interfaces/videolearn.interface';

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
    nombreVideoLearn,
    idEstado,
    nombreDocenteRevisor,
    usuarioCreador,
  }: videoLearnsGetQuery) {
    if (!pages) pages = 1;
    if (!limit) limit = 5;
    let query: string = `?pages=${pages}&limit=${limit}`;

    if (idAsignatura) query += `&idAsignatura=${idAsignatura}`;
    if (idNivel) query += `&idNivel=${idNivel}`;
    if (nombreVideoLearn && nombreVideoLearn !== '')
      query += `&nombreVideoLearn=${nombreVideoLearn}`;
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
    idVideoLearn,
    pregunta
  }: GetQuestionsQuery) {
    let query: string = `?idVideoLearn=${idVideoLearn}`;
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
    return this.http.get<getVideolearn>(`videolearn/${idVideoLearn}`, {
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
    return this.http.get<verObservacionesVideolearn>(`videolearn/visualizarObservacionesVideoLear/${idVideoLearn}`, {
      headers: this.headers,
    });
  }

  sendObservationVideolearn(videolearn: sendObservationVideolearn){
    return this.http.post('videolearn/observaciones',videolearn, {
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

  SaveVideoLearnToReview(idVideoLearn:number){
    return this.http.post(`videolearn/guardarVideoLearn/${idVideoLearn}`, {}, {
      headers: this.headers,
    });
  }

  getSimulatorSaver(){
    return this.http.get<ListVideoLearnSaved>('videolearn/listaVideoLearnGuardado', {
      headers: this.headers,
    });
  }

  getVideoLearnsSavers({
    pages,
    limit,
    idAsignatura,
    idNivel,
    nombreVideoLearn,
  }: videoLearnsRealizedGetQuerys) {
    if (!pages) pages = 1;
    if (!limit) limit = 5;
    let query: string = `?pages=${pages}&limit=${limit}`;

    if (idAsignatura) query += `&idAsignatura=${idAsignatura}`;
    if (idNivel) query += `&idNivel=${idNivel}`;
    if (nombreVideoLearn && nombreVideoLearn !== '')
      query += `&nombreVideoLearn=${nombreVideoLearn}`;

    return this.http.get<ListVideoLearnSaved>(`videolearn/listaVideoLearnGuardado${query}`, {
      headers: this.headers,
    });
  }

  startVideolearn(idVideolearn:number){
    return this.http.get<obtenerPreguntasRespuestas[]>(`videolearn/realizarVideoLearn/${idVideolearn}`, {
      headers: this.headers,
    });
  }

  saveResultTest(calificacion:calificacionVideolearn){
    return this.http.post('videolearn/videoLearnRealizado',calificacion,{
      headers: this.headers,
    });
  }

  saveVideoLearnStarted(idVideoLearn:number){
    return this.http.post(`videolearn/videoLearnRealizado/${idVideoLearn}`,{}, {
      headers: this.headers,
    });
  }

  getVideoLearnsRealized({
    pages,
    limit,
    idAsignatura,
    idNivel,
    nombreVideoLearn,
  }: videoLearnsRealizedGetQuerys) {
    if (!pages) pages = 1;
    if (!limit) limit = 5;
    let query: string = `?pages=${pages}&limit=${limit}`;

    if (idAsignatura) query += `&idAsignatura=${idAsignatura}`;
    if (idNivel) query += `&idNivel=${idNivel}`;
    if (nombreVideoLearn && nombreVideoLearn !== '')
      query += `&nombreVideoLearn=${nombreVideoLearn}`;

    return this.http.get<videoLearnsRealized>(`videolearn/videoLearnRealizadosTabla${query}`, {
      headers: this.headers,
    });
  }
}
