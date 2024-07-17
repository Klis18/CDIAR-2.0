import { HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ListaRecurso } from '../../academic-resources/interfaces/recurso.interface';
import { HelperHttpService } from '../../shared/services/helper.http.service';
import { ListMazo, Mazo, NewFlashcard, NewMazo, PreguntasMazo, updateSiguienteRepasoFlashcard, Flashcard, updateFlashcard, MazosGetQuery, EditMazo, FlashcardsGetQuery, updateStatusMazo, observation, sendObservationMazo } from '../interfaces/mazo.interface';
import { Asignatura } from '../../academic-resources/interfaces/asignatura.inteface';
import { Nivel } from '../../academic-resources/interfaces/nivel.inteface';
import { Docente } from '../../academic-resources/interfaces/docente.interface';
import { Estado } from '../../academic-resources/interfaces/estados.interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LearnService {

  private nombreMazoSource = new BehaviorSubject<string>('nombre inicial');
  nombreMazoActual = this.nombreMazoSource.asObservable();
  
  private http = inject(HelperHttpService);

  private headers = new HttpHeaders().set(
    'Authorization',
    `Bearer ${localStorage.getItem('token')}`
  );
  constructor() { }

  cambiarNombreMazo(nombreMazo: string) {
    this.nombreMazoSource.next(nombreMazo);
  }
  

  getDatosMazo(idMazo: number) {
    return this.http.get<Mazo>(`mazos/${idMazo}`, {
      headers: this.headers,
    });
  }

  addMazo(mazo:NewMazo){
    return this.http.post<NewMazo>('mazos/crear',mazo, {
      headers: this.headers,
    });
  }

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


  getFlashcardsMazo({ id, page, limit, preguntaFlashcard}: FlashcardsGetQuery) {
    if (!page) page = 1;

    if (!limit) limit = 5;

    let query: string = `?id=${id}&pages=${page}&limit=${limit}`;
    if (preguntaFlashcard && preguntaFlashcard !== '')
      query += `&preguntaFlashcard=${preguntaFlashcard}`;

    return this.http.get<PreguntasMazo>(`flashcards/flashcardsMazo${query}`, {
      headers: this.headers,
    });
  }

  addFlashcard(payload: { flashcards: NewFlashcard[]}) {
    return this.http.post('flashcards/crear', payload, {
      headers: this.headers
    });
  }

  estudiarFlashcards(idMazo: number) {
    return this.http.get(`flashcards/estudiar/${idMazo}`, {
      headers: this.headers,
    });
  }

  updateSiguienteRepasoFlashcard(flashcard: updateSiguienteRepasoFlashcard) {
    return this.http.post('flashcards/actualizarestudio', flashcard,{
      headers: this.headers,
    });
  }

  getFlashcard(idFlashcard: number) {
    return this.http.get<updateFlashcard>(`flashcards/flashcard/${idFlashcard}`, {
      headers: this.headers,
    });
  }

  updateFlashcard(flashcard:updateFlashcard){
    return this.http.put('flashcards/actualizar', flashcard, {
      headers: this.headers,
    });
  }

  deleteFlashcard(idFlashcard: number) {
    return this.http.delete(`flashcards/eliminar/${idFlashcard}`, {
      headers: this.headers,
    });
  }

  getMazos({
    page,
    limit,
    idAsignatura,
    idNivel,
    descripcion,
    idEstado,
    nombreDocenteRevisor,
    usuarioCreador,
  }: MazosGetQuery) {
    if (!page) page = 1;
    if (!limit) limit = 5;
    let query: string = `?pages=${page}&limit=${limit}`;

    if (idAsignatura) query += `&idAsignatura=${idAsignatura}`;
    if (idNivel) query += `&idNivel=${idNivel}`;
    if (descripcion && descripcion !== '')
      query += `&descripcion=${descripcion}`;
    if (idEstado) query += `&idEstado=${idEstado}`;
    if (nombreDocenteRevisor && nombreDocenteRevisor !== '')
      query += `&nombreDocenteRevisor=${nombreDocenteRevisor}`;
    if (usuarioCreador && usuarioCreador === true)
      query += `&usuarioCreador=${usuarioCreador}`;

    return this.http.get<ListMazo>(`mazos${query}`, {
      headers: this.headers,
    });
  }


  deleteMazo(idMazo:number){
    return this.http.delete(`mazos/eliminar/${idMazo}`, {
      headers: this.headers,
    });
  }

 editMazo(mazo:EditMazo){
  return this.http.put('mazos/editar', mazo, {
    headers: this.headers,
  });
 }

 publicarMazo(status: updateStatusMazo){
  return this.http.post('mazos/publicar',status, {
    headers: this.headers,
  });
 }

 enviarObservacion(observacion:sendObservationMazo){
  return this.http.post('mazos/observaciones',observacion, {
    headers: this.headers,
  });
 }

 getObservacion(idMazo:number){
  return this.http.get<observation>(`mazos/observaciones/${idMazo}`, {
    headers: this.headers,
  });
 }

 saveMazoToReview(idMazo:number){
  return this.http.post(`mazos/guardar/${idMazo}`,{}, {
    headers: this.headers,
  });
 }

 viewMazoToReview(){
  return this.http.get<ListMazo>(`mazos/guardados`, {
    headers: this.headers,
  });
 }

 getMazosGuardados({
  page,
  limit,
  idAsignatura,
  idNivel,
  descripcion,
}: MazosGetQuery) {
  if (!page) page = 1;
  if (!limit) limit = 5;
  let query: string = `?pages=${page}&limit=${limit}`;

  if (idAsignatura) query += `&idAsignatura=${idAsignatura}`;
  if (idNivel) query += `&idNivel=${idNivel}`;
  if (descripcion && descripcion !== '')
    query += `&descripcion=${descripcion}`;

  return this.http.get<ListMazo>(`mazos/guardados${query}`, {
    headers: this.headers,
  });
}


//MAZOS ESTUDIADOS

  guardarMazoEstudiado(idMazo:number){
    return this.http.post(`mazos/estudiado/${idMazo}`,{}, {
      headers: this.headers,
    });
  }


  getMazosEstudiados({
    page,
    limit,
    idAsignatura,
    idNivel,
    descripcion,
  }: MazosGetQuery) {
    if (!page) page = 1;
    if (!limit) limit = 5;
    let query: string = `?pages=${page}&limit=${limit}`;

    if (idAsignatura) query += `&idAsignatura=${idAsignatura}`;
    if (idNivel) query += `&idNivel=${idNivel}`;
    if (descripcion && descripcion !== '')
      query += `&descripcion=${descripcion}`;

    return this.http.get<ListMazo>(`mazos/estudiados${query}`, {
      headers: this.headers,
    });
  }

  getMazoEstudiado(idMazo:number){
    return this.http.get<Mazo>(`mazos/estudiado/${idMazo}`, {
      headers: this.headers,
    });
  }

  estudiarMazoGuardado(idMazo:number){
    return this.http.get(`flashcards/estudiarflashcardpediente/${idMazo}`,{
      headers: this.headers,
    });
  }

  actualizarRepasoFlashcardsGuardadas(update: updateSiguienteRepasoFlashcard){
    return this.http.put('flashcards/actualizarFlashCardEstudiada',update,{
      headers: this.headers,

  });
  }

  generarFlashcardsIa(mazo:NewMazo){
    return this.http.post('ia/generadorMazosIa',mazo,{
      headers: this.headers,
    });
  }
}
