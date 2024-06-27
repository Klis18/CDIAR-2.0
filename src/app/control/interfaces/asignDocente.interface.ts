import { inject } from '@angular/core';
export interface AsignaDocenteRevisor {
    idMazo:number
    idDocenteRevisor:string
}

export interface AsignaDocenteRevisorRecurso{
    id: number;
    idDocenteRevisor: string;
}

export interface RevisorGetQuery {
    page: number;
    limit: number;
    nombre?: string;
  }

export interface ListaDocenteRevisor{
    idDocente: string;
    nombresCompletos: string
    cedula: string;
    correo: string;
    telefono: string;
}