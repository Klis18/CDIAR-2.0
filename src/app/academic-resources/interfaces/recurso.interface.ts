export interface Recurso {
  idNivel: number;
  idAsignatura: number;
  tipoRecurso: string;
  nombreRecurso: string;
  enlaceDelRecurso: string | null;
  recurso: string | null;
  extension: string;
}

export interface ListaRecurso {
  idRecurso: number;
  nombreRecurso: string;
  asignatura: string;
  nivel: string;
  fechaCreacion: Date;
  tipoRecurso: string;
  usuarioCreacion: string;
  estadoRecurso: string;
  docenteRevisor: string;
  enlaceRecurso: string | null;
  recurso: string | null;
}

export interface RecursoResponse {
  idNivel: number;
  idAsignatura: number;
  tipoRecurso: string;
  estadoRecurso: number;
  nombreRecurso: string;
  enlaceDelRecurso: string | null;
  recurso: string | null;
  docenteRevisor: string;
  observacion: string;
}

export interface RecursoEdit {
  idRecurso: number;
  idNivel: number;
  idAsignatura: number;
  idEstado: number;
  tipoRecurso: string;
  enlaceDelRecurso: string;
  nombreRecurso: string;
  idDocenteRevisor: string;
  observacion: string;
  observacionesArchivo: string;
  recurso?: string;
  extension?: string;
}
