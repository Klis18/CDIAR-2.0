export interface usersData{
    nombresCompletos: string;
    cedula: string;
    correo: string;
    telefono: string;   
    rol: string;
    fechaRegistro: string;
}

export interface userDataGetQuery{
    pages: number;
    limit: number;
    nombresCompletos: string;
}