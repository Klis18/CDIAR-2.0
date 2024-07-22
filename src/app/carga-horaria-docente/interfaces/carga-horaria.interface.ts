export interface diasSemana{
    idDiaSemana: number;
    nombre: string;
}


export interface listaCargaHoraria{
    idCargaHoraria: number;
    nombreDocente: string;
    diaSemana: string;
    actividad: string;
    horaDesde: string;
    horaHasta: string;
}


export interface cargaHoraria{
    idCargaHoraria: number;
    idDocente: number;
    idDiaSemana: number;
    actividad: string;
    horaDesde: string;
    horaHasta: string;
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
    idDocente: number;
    diaSemana: number;
    actividad: string;
    horaDesde: string;
    horaHasta: string;
}