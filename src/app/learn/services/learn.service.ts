import { HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ListaRecurso } from '../../academic-resources/interfaces/recurso.interface';
import { HelperHttpService } from '../../shared/services/helper.http.service';
import { ListMazo, Mazo, NewFlashcard, NewMazo, PreguntasMazo, updateSiguienteRepasoFlashcard, Flashcard, updateFlashcard, MazosGetQuery, EditMazo } from '../interfaces/mazo.interface';
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
  
  // getMazos() {
  //   return this.http.get<ListMazo>('mazos', {
  //     headers: this.headers,
  //   });
  // }

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


  getFlashcardsMazo({ id, page, limit }: { id:number, page: number; limit: number }) {
    if (!page) page = 1;

    if (!limit) limit = 5;

    let query: string = `?id=${id}&pages=${page}&limit=${limit}`;

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
}
