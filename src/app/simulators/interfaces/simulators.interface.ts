export interface ListSimulators{
    idSimulador: number;
    cantidadPreguntas: number;
    usuarioCreador: string;
    fechaCreacion: string;
    estado: string;
    nombreDocenteRevisor: string;
    nombreSimulador: string;
    asignatura: string;
    nivel: string;
}

export interface Simulator {
    idAsignatura: number;
    idNivel: number; 
    nivel: string;
    asignatura: string;   
    usuarioCreador: string;
    fechaCreacion: string;
    estado: string;
    nombreSimulador: string;
    cantidadPreguntas: number;
    preguntas: string[];
    nombreRevisor: string;
}

export interface SimulatorsGetQuery {
    page: number;
    limit: number;
    idNivel?: number;
    idAsignatura?: number;
    nombreSimulador?: string;
    idEstado?: number;
    nombreDocenteRevisor?: string;
    usuarioCreador?: boolean;
}

export interface QuestionsSimulatorsGetQuery {
    idSimulador: number;
    page: number;
    limit: number;
    pregunta?: string;
}

export interface NewSimulator{
    idAsignatura: string;
    idNivel: string
    nombreSimulador: string;
}

export interface UpdateSimulator{
    idSimulador: number;
    idAsignatura: string;
    idNivel: string;
    nombreSimulador: string;

}

export interface NewSimulatorQuestion{
    idSimulador: number;
    pregunta: string;
    idTipoPregunta: number;
    opcionesRespuestas: OptionsQuestion[];
}

export interface OptionsQuestion{
    respuesta: string;
    esCorrecta: boolean;
}

export interface UpdateSimulatorQuestion{
    idSimulador: number;
    idPregunta: number;
    pregunta: string;
    idTipoPregunta: number;
    opcionesRespuestas: OptionsQuestion[];
}
export type typeTable = 'Publicado' | 'Mis Simuladores' | 'Por Aprobar' | 'Simuladores' | 'Guardados' | 'Estudiados';

export interface SimulatorsQuestions{
    idPregunta: number;
    pregunta: string;
    tipoPregunta: string;
    fechaCreacion: Date;
    opcionesRespuestas: OptionsQuestion[];
}

export interface TipoPreguntas{
    idTipoPregunta: number;
    tipoPregunta: string;
}