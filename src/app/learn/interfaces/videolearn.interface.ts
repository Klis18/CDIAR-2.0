export interface addVideolearn {
    idAsignatura: number;
    idNivel: number;
    nombreVideoLearn: string;
    enlaceVideo: string;
}

export interface editVideoLearn {
    idAsignatura: number;
    idNivel: number;
    nombreVideoLearn: string;
    enlaceVideo: string;
    idVideoLearn: number;
}

export interface addQuestionsVideolearn {
    idVideoLearn: number;
    pregunta: string;
    opcionesRespuestas: opcionesRespuestas[];
}

export interface opcionesRespuestas{
    respuesta: string;
    esCorrecta: boolean;
}

export interface editQuestionsVideolearn {
    idVideoLearn: number;
    pregunta: string;
    opcionesRespuestas: opcionesRespuestas[];
    idPregunta: number;
}

export interface videoLearnsGetQuery {
    pages: number;
    limit: number;
    idNivel: number;
    idAsignatura: number;
    nombreSimulador: string;
    idEstado?: number;
    nombreDocenteRevisor: string;
    usuarioCreador: boolean;
}

export interface ListVideolearn {
    idVideoLearn: number;
    nombreVideoLearn: string;
    asignatura: string;
    nivel: string;
    usuarioCreador: string;
    fechaCreacion: string;
    estado: string;
    observacion: string;
    nombreDocenteRevisor: string;
    enlaceVideoLearn: string;
    cantidadPreguntas: number;
    numeroRevisiones: number;
    preguntas: Preguntas[];
}

export interface Preguntas{
    idPregunta: number;
    pregunta: string;
    tipoPregunta: string;
    fechaCreacion: string;
    opcionesRespuestas: opcionesRespuestas[];
}

export interface GetQuestionsQuery{
    idVideoLearn: number;
    pages: number;
    limit: number;
    pregunta: string;
}

export interface obtenerPreguntasRespuestas{
    idPregunta: number;
    pregunta: string;
    tipoPregunta: string;
    fechaCreacion: string;
    opcionesRespuestas: opcionesRespuestas[];
}

export interface getQuestionVideolearn{
    idVideolearn: number;
    pregunta: string;
    opcionesRespuestas: opcionesRespuestas[];
    idPregunta: number;
}

export interface getVideolearn{
    idAsignatura: number;
    asignatura: string;
    idNivel: number;
    nivel: string;
    usuarioCreador: string;
    fechaCreacion: string;
    estado: string;
    nombreVideoLearn: string;
    cantidadPreguntas: number;
    preguntas: Preguntas[];
    nombreRevisor: string;
}

export interface asignarRevisorVideolearn{
    idVideoLearn: number;
    idDocenteRevisor: string;
}

export interface verObservacionesVideolearn{
    observacion: string;
    observacionesArchivo: string;
}

export interface sendObservationVideolearn{
    idVideoLearn: number;
    observacion: string;
    observacionesArchivo: string;
}

export interface updateStatusVideolearn{
    idVideoLearn: number;
    idEstado: number;
}

export type typeTable = 'Publicado' | 'Mis VideoLearns' | 'Por Aprobar' | 'VideoLearns' | 'Guardados' | 'Realizados';

export interface videoYtb{
    url:string;
}