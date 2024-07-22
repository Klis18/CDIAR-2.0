import { Injectable, inject } from '@angular/core';
import { HelperHttpService } from '../../shared/services/helper.http.service';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../auth/services/auth.service';
import {
  ListaDocentes,
  ListaDocentesPorAprobar,
} from '../interfaces/lista-docentes.interface';
import { DocenteAprobacion } from '../interfaces/docente-aprobacion.interface';
import {AsignaDocenteRevisorMazo, AsignaDocenteRevisorRecurso, AsignaDocenteRevisorSimulador, AsignaDocenteRevisorVideoLearn, ListaDocenteRevisor, RevisorGetQuery } from '../interfaces/asignDocente.interface';
import { Docente } from '../../academic-resources/interfaces/docente.interface';
import { mallaAcademica, addAsignatura, updateAsignatura, addNivel, updateNivel, mallaAcademicaGetQuerys, mallaAcademicaNivelesGetQuerys, mallaAcademicaNiveles } from '../interfaces/malla-academica.interface';


@Injectable({
  providedIn: 'root',
})

export class SecurityService {

  private http = inject(HelperHttpService);
  private headers = new HttpHeaders().set(
    'Authorization',
    `Bearer ${localStorage.getItem('token')}`
  );

  constructor(private authService: AuthService) {
    this.authService.checkAuthStatus().subscribe();
  }

  getListaDocenteAprobar() {
    return this.http.get<ListaDocentesPorAprobar>(
      'admin/listaDocentesPorAprobar',
      {
        headers: this.headers,
      }
    );
  }

  aprobarDocente(docente: DocenteAprobacion) {
    return this.http.post<DocenteAprobacion>('admin/aprobarDocente', docente, {
      headers: this.headers,
    });
  }

  getListaDocentes() {
    return this.http.get<ListaDocentes>('admin/listaDocentes', {
      headers: this.headers,
    });
  }

  asignarRevisorMazo(revisor: AsignaDocenteRevisorMazo) {
    return this.http.post<AsignaDocenteRevisorMazo>('mazos/asignarrevisor',revisor, {
      headers: this.headers,
    });
  }


  getDocentesRevision() {
    return this.http.get<Docente>('docentesrevision', {
      headers: this.headers,
    });
  }

  asignarRevisorRecurso(revisor: AsignaDocenteRevisorRecurso) {
    return this.http.post<AsignaDocenteRevisorRecurso>('recursos/asignarrevisor',revisor, {
      headers: this.headers,
    });
  }

  asignaRevisorSimulador(revisor: AsignaDocenteRevisorSimulador) {
    return this.http.post<AsignaDocenteRevisorSimulador>('simuladores/asignarRevisor',revisor, {
      headers: this.headers,
    });
  }

  asignaRevisorVideoLearn(revisor: AsignaDocenteRevisorVideoLearn) {
    return this.http.post<AsignaDocenteRevisorVideoLearn>('videolearn/asignarrevisor',revisor, {
      headers: this.headers,
    });
  }

  getDocRevisores({
    page,
    limit,
    nombre
  }: RevisorGetQuery) {
    if (!page) page = 1;
    if (!limit) limit = 5;
    let query: string = `?pages=${page}&limit=${limit}`;
  
  
    if (nombre && nombre !== '')
      query += `&nombre=${nombre}`;
    
    return this.http.get<ListaDocenteRevisor>(`docentesrevision${query}`, {
      headers: this.headers,
    });
  }


  //-------------------MALLA ACADÉMICA-------------------

    listaMallaAcademica({
      pages,
      limit,
      idNivel,
      idAsignatura
    }: mallaAcademicaGetQuerys) {
      if (!pages) pages = 1;
    if (!limit) limit = 5;
    let query: string = `?pages=${pages}&limit=${limit}`;
  
  
    if (idNivel && idNivel !== 0)
      query += `&idNivel=${idNivel}`;
    if (idAsignatura && idAsignatura !== 0)
      query += `&idAsignatura=${idAsignatura}`;

      return this.http.get<mallaAcademica>(`mallaacademica${query}`, {
        headers: this.headers,
      });
    }


    listaMallaAcademicaNiveles({
      idNivel,
    }: mallaAcademicaNivelesGetQuerys) {
    //   if (!pages) pages = 1;
    // if (!limit) limit = 5;
    // let query: string = `?pages=${pages}&limit=${limit}`;
    let query: string = `?`;
    if (idNivel && idNivel !== 0)
      query += `&idNivel=${idNivel}`;

      return this.http.get<mallaAcademicaNiveles>(`mallaacademica/niveles${query}`, {
        headers: this.headers,
      });
    }

    addAsignatura(asignatura: addAsignatura) {
      return this.http.post<addAsignatura>('mallaacademica/crearMateria', asignatura, {
        headers: this.headers,
      });
    }

    updateAsignatura(asignatura: updateAsignatura) {
      return this.http.put<updateAsignatura>('mallaacademica/editarMateria', asignatura, {
        headers: this.headers,
      });
    }

    deleteAsignatura(idAsignatura: number) {
      return this.http.delete(`mallaacademica/eliminarMateria/${idAsignatura}`, {
        headers: this.headers,
      });
    }

    addNivel(nivel: addNivel) {
      return this.http.post<addNivel>('mallaacademica/crearNivel', nivel, {
        headers: this.headers,
      });
    }

    getNivel(idNivel: number) {
      return this.http.get<updateNivel>(`mallaacademica/niveles/${idNivel}`, {
        headers: this.headers,
      });
    }

    getAsignatura(idAsignatura: number) {
      return this.http.get<updateAsignatura>(`mallaacademica/asignaturas/${idAsignatura}`, {
        headers: this.headers,
      });
    }

    updateNivel(nivel: updateNivel) {
      return this.http.put<updateNivel>('mallaacademica/editarNivel', nivel, {
        headers: this.headers,
      });
    }

    deleteNivel(idNivel: number) {
      return this.http.delete(`mallaacademica/eliminarNivel/${idNivel}`, {
        headers: this.headers,
      });
    }

  //---------------------FIN MALLA ACADÉMICA--------------------------------
}



