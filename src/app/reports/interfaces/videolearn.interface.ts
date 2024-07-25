export interface videoLearnsReportGetQuery{
    nombreVideoLearn: string;
    nombreEstudiante: string;
    idAsignatura: number;
    idNivel: number;
    pages: number;
    limit: number;
}

export interface VideoLearnsReport{
    nombreVideoLearn: string;
    asignatura: string;
    nivel: string;
    nombreEstudiante: string;
    calificacion: number;
    fechaVideoLearnRealizado: string;
}