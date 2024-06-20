import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditResourceComponent } from '../../../academic-resources/components/edit-resource/edit-resource.component';
import { ListaRecurso } from '../../../academic-resources/interfaces/recurso.interface';
import { ResourcesComponent } from '../../../academic-resources/pages/resources/resources.component';
import { RecursoService } from '../../../academic-resources/services/recurso.service';
import { HomeService } from '../../../home/services/home.service';

@Component({
  selector: 'app-asignar-revisor',
  templateUrl: './asignar-revisor.component.html',
  styles: ``
})
export class AsignarRevisorComponent {
 

  @Input() filterByStatus: string = '';

  usuario: string = '';
  searchInfo: any;
  
  data: ListaRecurso[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  selectedTab ='Recursos Académicos';
  nombreRecurso: string = '';
  nivel: string = '';
  asignatura: string = '';

  constructor(
    private recursoService: RecursoService,
    private academic: ResourcesComponent,
    private dialog: MatDialog,
    private homeService: HomeService
  ) {}

  ngOnInit(): void {
    this.listaRecursos();

    this.homeService.obtenerDatosMenu().subscribe((user) => {
      console.log(user);
      this.usuario = user.data.userName;
    });
    // this.selectedTab = 'Recursos Académicos';
  }


  listaRecursos() {
    const paginate = {
      page: 1,
      limit: 5,
    };
    this.recursoService.getRecursos(paginate).subscribe((res: any) => {
      console.log(res);
      this.data = res?.data ?? [];
      if (res?.data) {
        this.nombreRecurso = res.data.nombreRecurso;
        this.nivel = res.data.nivel;
        this.asignatura = res.data.asignatura;
      }
    });
  }

  get paginatedData(): ListaRecurso[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;

    const filteredData = this.data.filter(
      (item) => item.docenteRevisor === '' && item.estadoRecurso === 'Ingresado'
    );
    return filteredData.slice(start, end);
  }

  editarRecurso(idRecurso: number) {
    this.dialog.open(EditResourceComponent, {
      width: '40%',
      data: idRecurso,
    });
  }
  getStyleColor(tipoRecurso: string) {
    switch (tipoRecurso) {
      case 'Archivo':
        return 'bg-cyan-700';
      case 'Link':
        return 'bg-orange-600';
      case 'Imagen':
        return 'bg-pink-700';
      default:
        return '';
    }
  }

  openFileInTab(item: any): string {
    let urlRecurso: string = '';

    if (item.tipoRecurso === 'Link') {
      urlRecurso = item.enlaceRecurso;
    } else if (
      item.tipoRecurso === 'Archivo' ||
      item.tipoRecurso === 'Imagen'
    ) {
      urlRecurso = item.recurso;
    }
    return urlRecurso;
  }

  emitSearch(res: any) {
    if (res) {
      this.searchInfo = res;
    }
  }
  reloadTable: boolean = false;

  loadedTale() {
    this.reloadTable = false;
  }

  // openDialog() {
  //   const dialogRef = this.dialog.open(AddMazoComponent, {
  //     width: '40%',
  //     maxHeight: '80%',
  //   });
  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result) {
  //       this.loadTable();
  //     }
  //   });
  // }
}
