export interface mallaAcademica {
    asignatura: string;
    nivel: string;
    idNivel: number;
    idAsignatura: number;
}

export interface mallaAcademicaGetQuerys{
    pages: number;
    limit: number;
    idNivel: number;
    idAsignatura: number;
}

export interface mallaAcademicaNiveles{
    idNivel: number;
    descripcion: string;
    color1: string;
    color2: string;
}

export interface mallaAcademicaNivelesGetQuerys{
    pages: number;
    limit: number;
    idNivel: number;
}

export interface addAsignatura{
    nombre: string;
    idNivel: number;
}

export interface updateAsignatura{
    nombre: string;
    idNivel: number;
    idAsignatura: number;
}

export interface addNivel{
    descripcion: string;
}

export interface updateNivel{
    descripcion: string;
    idNivel: number;
}

