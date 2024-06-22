export interface ListMazo{
    idMazo: number;
    asignatura: string;
    nivel: string;
    usuarioCreador: string;
    fechaCreacion: string;
    estado: string;
    nombreMazo: string;
    cantidadFlashcards: number;
    nombreDocenteRevisor: string;
}


export interface Mazo{
    idMazo: number;
    idAsignatura: number;
    idNivel: number;    
    usuarioCreador: string;
    fechaCreacion: string;
    estado: string;
    nombreMazo: string;
    cantidadFlashcards: number;
    nombreRevisor: string;
    preguntas: string[];
}

export interface NewMazo{
    nombreMazo: string;
    idAsignatura: string;
    idNivel: string
}

export interface PreguntasMazo{
    idFlashcard: number;
    pregunta: string;
    respuesta: string;
    nombreMazo: string;
    siguienteRepaso: string;
    ultimoRepaso: string;
    fechaCreacion: string;
}

export interface NewFlashcard{
    idMazo: number;
    pregunta: string;
    respuesta: string;
}

export interface Flashcard{
    idFlashcard: number;
    pregunta: string;
    respuesta: string;
    nombreMazo: string;
    siguienteRepaso: Date;
    ultimoRepaso: Date;
    fechaCreacion: Date;
}

export interface updateSiguienteRepasoFlashcard{
    idFlashcard: number;
    siguienteRepaso: string;
}

export interface updateFlashcard{
    idFlashcard: number;
    pregunta: string;
    respuesta: string;

}


export type typeTable = 'Publicado' | 'Mis Flashcards' | 'Por Aprobar' | 'Flashcards';


export interface MazosGetQuery {
    page: number;
    limit: number;
    idNivel?: number;
    idAsignatura?: number;
    descripcion?: string;
    idEstado?: number;
    nombreDocenteRevisor?: string;
}

export interface EditMazo{
    nombreMazo: string,
    idAsignatura: 0,
    idNivel: 0,
    idMazo: 0,
}