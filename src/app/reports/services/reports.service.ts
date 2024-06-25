import { Injectable, inject } from '@angular/core';
import { HelperHttpService } from '../../shared/services/helper.http.service';
import { HttpHeaders } from '@angular/common/http';
import { usersData } from '../interfaces/users.interface';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  private http = inject(HelperHttpService);

  private headers = new HttpHeaders().set(
    'Authorization',
    `Bearer ${localStorage.getItem('token')}`
  );
  constructor() { }

  getDataUsuarios(){
    return this.http.get<usersData>('usuario/usuarios', {
      headers: this.headers,
    });
  }
}
