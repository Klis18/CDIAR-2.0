export interface addMeta{
    idAsignatura: number;
    idNivel: number;
    calificacionPrimerParcial: number;
    puntajeObjetivo: number;
}

export interface updateMeta{
    idAsignatura: number,
    idNivel: number,
    calificacionPrimerParcial: number,
    puntajeObjetivo: number,
    idMeta: number,
    calificacionSegundoParcial: number
}


export interface listadoMetas{
    idMeta: number,
      asignatura: string,
      nivel: string,
      calificacionPrimerParcial: number,
      calificacionSegundoParcial: number,
      promedio: number,
      puntajeObjetivo: number
}

export interface listadoMetasGetQuerys{
    pages: number,
    limit: number,
    idNivel: number
    idAsignatura: number,
}

export interface getMeta{
    idMeta: number,
    idAsignatura: number,
    asignatura: string,
    nivel: string,
    idNivel: number,
    calificacionPrimerParcial: number,
    calificacionSegundoParcial: number,
    promedio: number,
    puntajeObjetivo: number
}