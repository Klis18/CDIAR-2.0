export interface SimuladoresGetQuery {
  nombreSimulador: string;
  id: number;
  idNivel: number;
  idAsignatura: number;
  page: number;
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
