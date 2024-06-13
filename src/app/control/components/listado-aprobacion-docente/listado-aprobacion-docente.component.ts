import { Component, OnInit, inject } from '@angular/core';
import { ListaDocentesPorAprobar } from '../../interfaces/lista-docentes.interface';
import { DocenteAprobacion } from '../../interfaces/docente-aprobacion.interface';
import { SecurityService } from '../../services/security.service';

@Component({
  selector: 'listado-aprobacion-docente',
  templateUrl: './listado-aprobacion-docente.component.html',
  styles: ``
})
export class ListadoAprobacionDocenteComponent implements OnInit{

  data: ListaDocentesPorAprobar[] = [];
  docenteAprobado: boolean = false;
  nombresCompletos: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  cedula: string = '';
  correo: string = '';
  telefono: string = '';
  fechaSolicitud: Date = new Date();
  private securityService = inject(SecurityService);

  ngOnInit(): void {
    this.listaDocentes();
    console.log(this.listaDocentes());
  }

  listaDocentes() {
    this.securityService.getListaDocenteAprobar().subscribe((res: any) => {
      this.data = res.data;
      this.nombresCompletos = res.data.nombresCompletos;
      this.cedula = res.data.cedula;
      this.correo = res.data.correo;
      this.telefono = res.data.telefono;
      this.fechaSolicitud = res.data.fechaSolicitud;
    });
  }

  get paginatedData(): ListaDocentesPorAprobar[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.data.slice(start, end);
  }

  getCurrentDocente(docente: DocenteAprobacion) {
    docente.correo = this.correo;
    return docente;
  }

  // aprobarDocente(docente: DocenteAprobacion) {
  //   docente.aprobado = true;
  //   this.securityService.aprobarDocente(docente).subscribe((res) => {
  //     console.log(res);
  //   });
  // }

  aprobarDocente(correo: string, aprobado: boolean) {
    const docente = { correo, aprobado };
    // docente.aprobado = true;
    this.securityService.aprobarDocente(docente).subscribe((res) => {
      console.log(res);
    });
  }

  // rechazarDocente(docente: DocenteAprobacion) {
  //   docente.aprobado = false;
  //   this.securityService.aprobarDocente(docente).subscribe((res) => {
  //     console.log(res);
  //   });
  // }

  rechazarDocente(correo: string, aprobado: boolean) {
    const docente = { correo, aprobado };
    //docente.aprobado = false;
    this.securityService.aprobarDocente(docente).subscribe((res) => {
      console.log(res);
    });
  }
}
