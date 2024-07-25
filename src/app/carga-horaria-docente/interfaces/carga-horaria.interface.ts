import { ListaCargaHoraria } from '../../control/interfaces/cargaHoraria.interface';
export interface diasSemana{
    idDiaSemana: number;
    nombre: string;
}


export interface listaCargaHoraria{
    idCargaHoraria: number;
    idDocente: string;
    nombreDocente: string;
    diaSemana: string;
    diaSemanaNumero: number;
    actividad: string;
    horaDesde: string;
    horaHasta: string;
}

export interface ListaCargaHorariaDocenteGetQuery{
    diaSemana: number;
    actividad: string;
    pages: number;
    limit: number;
}

export interface cargaHoraria{
    idCargaHoraria: number;
    idDocente: string;
    nombreDocente: string;
    diaSemana: number;
    diaSemanaNumero: number;
    actividad: string;
    horaDesde: string;
    horaHasta: string;
}

export interface ListaCargaHorariaGetQuery{
    id:string;
    diaSemana: number;
    actividad: string;
    pages: number;
    limit: number;
}


export interface addCargaHoraria{
    diaSemana: number;
    actividad: string;
    horaDesde: string;
    horaHasta: string;
}

export interface cargaHorariaDocenteDia{
    idCargaHoraria: number;
    nombreDocente: string;
    diaSemana: number;
    actividad: string;
    horaDesde: string;
    horaHasta: string;
}

export interface updateCargaHoraria{
    idCargaHoraria: number;
    idDocente: string;
    diaSemana: number;
    actividad: string;
    horaDesde: string;
    horaHasta: string;
}