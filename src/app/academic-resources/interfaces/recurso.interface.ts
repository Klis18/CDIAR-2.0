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

export type typeTable = 'Publicado' | 'Mis Recursos' | 'Por Aprobar'| 'Asignar Revisor';

export type ModeFormsResources =
  | 'Edit'
  | 'Add'
  | 'Por Aprobar'
  | 'Asignar Revisor';

export interface ListaRecurso {
  idRecurso: number;
  nombreRecurso: string;
  asignatura: string;
  nivel: string;
  fechaCreacion: Date;
  tipoRecurso: string;
  usuarioCreacion: string;
  estadoRecurso: EstadosRecursos;
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
  enlaceDelRecurso?: string | null;
  nombreRecurso: string;
  idDocenteRevisor: string;
  observacion: string;
  observacionesArchivo: string;
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
}