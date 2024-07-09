export interface Recurso {
  idNivel: number;
  idAsignatura: number;
  tipoRecurso: string;
  nombreRecurso: string;
  enlaceDelRecurso: string | null;
  recurso: string | null;
  extension: string | null;
}

export type EstadoRecursosType =
  | 'Ingresado'
  | 'Aprobado'
  | 'Rechazado'
  | 'Eliminado';

export enum EstadosRecursos {
  INGRESADO = 'Ingresado',
  APROBADO = 'Aprobado',
  RECHAZADO = 'Rechazado',
  ELIMINADO = 'Eliminado',
}

export enum RecursosIdEstados {
  INGRESADO = 1,
  APROBADO = 2,
  RECHAZADO = 3,
  ELIMINADO = 4,
}

export type typeTable =
  | 'Publicado'
  | 'Mis Recursos'
  | 'Por Aprobar'
  | 'Asignar Revisor'
  | 'Recursos revisados';

export type ModeFormsResources =
  | 'Edit'
  | 'Add'
  | 'Por Aprobar'
  | 'Asignar Revisor'
  | 'Corregir Recurso'
  | 'Recursos revisados';

export interface ListaRecurso {
  idRecurso: number;
  nombreRecurso: string;
  asignatura: string;
  nivel: string;
  fechaCreacion: Date;
  tipoRecurso: string;
  //recursoRevisadoDato?: any;
  usuarioCreacion: string;
  estadoRecurso: EstadosRecursos;
  docenteRevisor: string;
  enlaceRecurso: string | null;
  recurso: string | null;
  validado: boolean;
  numeroRevisiones: number;
}

export interface RecursoResponse {
  idRecurso: number;
  idNivel: number;
  idAsignatura: number;
  idEstado: number;
  tipoRecurso: string;
  estadoRecurso: number;
  nombreRecurso: string;
  enlaceDelRecurso: string | null;
  recurso: string | null;
  docenteRevisor: string;
  observacion: string;
  usuarioCreacion: string;
  fechaCreacion: string;
  idDocenteRevisor: string;
  nombreDocenteRevisor: string;
  observacionesArchivo: string;
}

export interface RecursoEdit {
  idRecurso: number;
  idNivel: number;
  idAsignatura: number;
  idEstado: number;
  tipoRecurso: string;
  enlaceDelRecurso?: string | null;
  nombreRecurso: string;
  idDocenteRevisor: string;
  observacion?: string | null;
  observacionesArchivo?: string | null;
  extensionObservaciones?: string | null;
  recurso?: string | null;
  extension?: string | null;
}

export interface RecursosGetQuery {
  page: number;
  limit: number;
  idNivel?: number;
  idAsignatura?: number;
  descripcion?: string;
  idEstado?: number;
  revisor?: boolean;
}

export interface approveResource {
  idRecurso: number;
  idEstado: number;
}

export interface sendObservationResource{
  idRecurso: number;
  observacion: string;
  observacionesArchivo: string;
}
