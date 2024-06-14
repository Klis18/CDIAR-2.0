import { HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ListaRecurso } from '../../academic-resources/interfaces/recurso.interface';
import { HelperHttpService } from '../../shared/services/helper.http.service';
import { ListMazo, Mazo } from '../interfaces/mazo.interface';

@Injectable({
  providedIn: 'root'
})
export class LearnService {

  private http = inject(HelperHttpService);

  private headers = new HttpHeaders().set(
    'Authorization',
    `Bearer ${localStorage.getItem('token')}`
  );
  constructor() { }

  getMazos() {
    return this.http.get<ListMazo>('mazos', {
      headers: this.headers,
    });
  }

  getDatosMazo(idMazo: number) {
    return this.http.get<Mazo>(`mazos/${idMazo}`, {
      headers: this.headers,
    });
  }
}
