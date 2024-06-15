export interface ListMazo{
    idMazo: number;
    asignatura: string;
    nivel: string;
    usuarioCreador: string;
    fechaCreacion: string;
    estado: string;
    nombreMazo: string;
    cantidadFlashcards: number;
}


export interface Mazo{
    preguntas: string[];
    nombreRevisor: string;
    idMazo: number;
    asignatura: string;
    nivel: string;
    usuarioCreador: string;
    fechaCreacion: string;
    estado: string;
    nombreMazo: string;
    cantidadFlashcards: number;
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