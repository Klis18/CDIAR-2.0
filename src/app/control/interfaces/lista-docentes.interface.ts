export interface ListaDocentesPorAprobar {
  cedula: string;
  nombresCompletos: string;
  correo: string;
  telefono: string;
  fechaSolicitud: Date;
}

export interface ListaDocentes {
  idDocente: string;
  cedula: string;
  nombresCompletos: string;
  correo: string;
  telefono: string;
}
