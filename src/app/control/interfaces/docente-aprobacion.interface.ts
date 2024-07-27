export interface DocenteAprobacion {
  correo: string;
  aprobado: boolean;
}

export interface DocentesAprobarGetQuery{
  nombreDocente: string;
  pages: number;
  limit: number;
}
