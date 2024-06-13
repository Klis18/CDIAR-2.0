import {
  Component,
  Inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core';
import { ListaRecurso } from '../../interfaces/recurso.interface';
import { RecursoService } from '../../services/recurso.service';
import { HomeService } from '../../../home/services/home.service';
import { MatDialog} from '@angular/material/dialog';
import { CardConfirmComponent } from '../../../shared/pages/card-confirm/card-confirm.component';
import { EditResourceComponent } from '../edit-resource/edit-resource.component';
import { ResourcesComponent } from '../../pages/resources/resources.component';
import { AsignarRevisorComponent } from '../../../control/pages/asignar-revisor/asignar-revisor.component';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'resources-table',
  templateUrl: './resources-table.component.html',
  styles: ``,
})
export class ResourcesTableComponent implements OnInit, OnChanges{
  @Input() filterByUser: string = '';
  @Input() filterByStatus: string = '';
  @Input() filterByRevisor: string = '';
  @Input() searchData: any;
  data: ListaRecurso[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  selectedTab = this.academic.selectedTab;
  selectedTab2 = this.aprove.selectedTab;
  nombreRecurso: string = '';
  nivel: string = '';
  asignatura: string = '';
  limitsOptions = [
    {
      label: '5 Elementos',
      value: 5,
    },
    {
      label: '10 Elementos',
      value: 10,
    },
    {
      label: '15 Elementos',
      value: 15,
    },
  ];
  limit: number = 5;
  mensaje: string = '';
  tituloRecurso: string = '';
  usuario: string = '';
  resourceTable!: FormGroup;    
  
  constructor(
    private recursoService: RecursoService,
    private academic: ResourcesComponent,
    @Inject(AsignarRevisorComponent) private aprove: AsignarRevisorComponent,
    @Inject(HomeService) private homeService: HomeService,
    @Inject(FormBuilder) private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    console.log({ changes });
    if (changes['searchData']) {
      console.log('El valor del input ha cambiado:', this.searchData);
    }
  }

  openDialog(message: string) {
    return this.dialog.open(CardConfirmComponent, {
      data: {
        mensaje: message,
      },
      width: '30%',
    });
  }

  // page!: number;
  // builderForm() {
  //   this.resourceTable = this.formBuilder.group({
  //     limit: [5],
  //     page: [1],
  //   });
  // }


  ngOnInit(): void {
    //this.builderForm();
    this.getDataMenu();
    // this.resourceTable.valueChanges.subscribe({
    //   next: (res) => {
    //     if (res?.limit) {
    //       this.limit = res?.limit;
    //     }
    //     if (res?.page) {
    //       this.page = res?.page;
    //     }
    //   },
    // });
    this.listaRecursos();
  }

  listaRecursos() {
    this.recursoService.getRecursos().subscribe((res: any) => {
      console.log(res);
      this.data = res.data;
      this.nombreRecurso = res.data.nombreRecurso;
      this.nivel = res.data.nivel;
      this.asignatura = res.data.asignatura;
    });
  }

  getDataMenu(){
    this.homeService.obtenerDatosMenu().subscribe((user) => {
      console.log(user);
      this.usuario = user.data.userName;
    });
  }

  get paginatedData(): ListaRecurso[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;

    const filteredData = this.data.filter(
      (item) =>
        (this.filterByUser
          ? item.usuarioCreacion === this.filterByUser
          : true) &&
        (this.filterByRevisor
          ? item.docenteRevisor === this.filterByRevisor
          : true) &&
        (this.filterByStatus
          ? item.estadoRecurso === this.filterByStatus
          : item.estadoRecurso !== 'Eliminado')
    );
    return filteredData.slice(start, end);
  }

  // listaRecursos() {
  //   const paginate = {
  //     page: this.resourceTable.get('page')?.value,
  //     limit: this.resourceTable.get('limit')?.value,
  //   };
  //   this.recursoService.getRecursos(paginate).subscribe((res: any) => {
  //     console.log(res);
  //     this.data = res.data;
  //     this.nombreRecurso = res.data.nombreRecurso;
  //     this.nivel = res.data.nivel;
  //     this.asignatura = res.data.asignatura;
  //     this.paginateCurrent = this.crearArreglo(this.limit, res.numRecord);
  //     console.log({ AJA: this.paginateCurrent });
  //   });
  // }

  // paginateCurrent: number[] = [];

  // crearArreglo(limite: number, cant: number) {
  //   console.log({ limite, cant });
  //   const elementos = Math.floor(cant / limite);
  //   console.log({ elementos });
  //   const arreglo = [];

  //   for (let i = 1; i <= elementos; i++) {
  //     arreglo.push(i);
  //   }
  //   if (elementos < 0) arreglo.push(1);
  //   arreglo.push(1);
  //   return arreglo;
  // }

  // get paginatedData(): ListaRecurso[] {
  //   const start = (this.currentPage - 1) * this.itemsPerPage;
  //   const end = start + this.itemsPerPage;

  //   const filteredData = this.data.filter(
  //     (item) =>
  //       (this.filterByUser
  //         ? item.usuarioCreacion === this.filterByUser
  //         : true) &&
  //       (this.filterByRevisor
  //         ? item.docenteRevisor === this.filterByRevisor
  //         : true) &&
  //       (this.filterByStatus
  //         ? item.estadoRecurso === this.filterByStatus
  //         : item.estadoRecurso !== 'Eliminado')
  //   );
  //   return filteredData.slice(start, end);
  // }

  eliminarRecurso(idRecurso: number) {
    const dialogRef = this.openDialog(
      '¿Estás seguro de eliminar este recurso?'
    );
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        console.log('Eliminando recurso', res);
        this.recursoService.eliminarRecurso(idRecurso).subscribe(() => {
          console.log('Recurso eliminado');
          this.listaRecursos();
        });
      }
    });
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
      
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
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
            
  getIcon(tipoRecurso: string) {
    switch (tipoRecurso) {
      case 'Archivo':
        return 'insert_drive_file';
      case 'Link':
        return 'insert_drive_file';
      case 'Imagen':
        return 'image';
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
    
    canEdit(item: any): boolean {
      const isCreator = item.usuarioCreacion == this.usuario && this.selectedTab === 'Mis Recursos' && item.estadoRecurso != 'Aprobado';
      const isReviewer = item.docenteRevisor == this.usuario && this.selectedTab === 'Por Aprobar' && item.estadoRecurso != 'Aprobado';
     const isAdmin = item.docenteRevisor === '' && item.estadoRecurso != 'Aprobado'&& this.selectedTab2 === 'Recursos Académicos';
      return isCreator || isReviewer || isAdmin;
    }

    editarRecurso(idRecurso: number, item:any) {
      if(this.canEdit(item)){
        if (item.usuarioCreacion == this.usuario) {
          this.tituloRecurso = 'Editar Recurso';
        } else if (item.docenteRevisor == this.usuario) {
          this.tituloRecurso = 'Aprobar Recurso';
        } else {
          this.tituloRecurso = 'Asignar Revisor';
        }
      }
      this.dialog.open(EditResourceComponent, {
        width: '40%',
        data: {id: idRecurso, titulo: this.tituloRecurso},
      });
    }
  }
      