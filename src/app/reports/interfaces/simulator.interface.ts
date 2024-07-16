export interface SimuladoresGetQuery {
  id: number;
  idNivel: number;
  idAsignatura: number;
  pages: number;
  limit: number;
}

export interface SimuladoresData {
  nombreSimulador: string;
  asignatura: string;
  nivel: string;
  nombreEstudiante: string;
  calificacion: number;
  fechaSimuladorRealizado: string;
}
