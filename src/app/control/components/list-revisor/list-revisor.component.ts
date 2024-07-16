import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { SecurityService } from '../../services/security.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RevisorGetQuery } from '../../interfaces/asignDocente.interface';

@Component({
  selector: 'list-revisor',
  templateUrl: './list-revisor.component.html',
  styles: ``
})
export class ListRevisorComponent implements OnInit, OnChanges{
  @Input() loadTable: boolean = false;
  @Output() loadedTableEmitter = new EventEmitter<boolean>();
  @Input() searchData: any;
  @Input() id!:number;
  @Input() opcion!:string;

  dataDocentes: any;
  // id = this.data.id;
  // opcion = this.data.opcion;
  data: any;
  nombre = '';
  searchInfo: any;
  revisors!: FormGroup;
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

  public page!: number;
  public limit: number = 5;
  public paginateCurrent: number[] = [];

  constructor(private securityService: SecurityService,
              @Inject(FormBuilder) private formBuilder: FormBuilder,
              // @Inject (MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<ListRevisorComponent>
  ){
    
  }

  // ngOnInit(){
  //   // this.getListaDocentes(); 
  //   this.listaDocentesRevisores();
  // }

 

  // getDocentesRevision(){
  //   this.securityService.getDocentesRevision().subscribe((res) => {
  //     this.dataDocentes = res.data;
  //     console.log(res);
  //   });
  
  // }



  asignarRevisor(idDocente: string){

    switch(this.opcion){
      case 'Mazo':
        const revisorMazo = {
          id: this.id,
          idDocenteRevisor: idDocente
        }
        this.securityService.asignarRevisorMazo(revisorMazo).subscribe((res) => {
          this.CloseModal('Revisor asignado exitosamente');      
        });
        break;
      case 'Recursos':
        const revisorRecurso = {
          id: this.id,
          idDocenteRevisor: idDocente
        }
        this.securityService.asignarRevisorRecurso(revisorRecurso).subscribe((res) => {
          this.CloseModal('Revisor asignado exitosamente');
        });
        break;
        case 'VideoLearns':
          const revisorVideoLearn = {
            idVideoLearn: this.id,
            idDocenteRevisor: idDocente
          }
          this.securityService.asignaRevisorVideoLearn(revisorVideoLearn).subscribe((res) => {
            this.CloseModal('Revisor asignado exitosamente');
          });
          break;
      case 'Simuladores':
        const revisorSimulador = {
          idSimulador: this.id,
          idDocenteRevisor: idDocente
        }
        this.securityService.asignaRevisorSimulador(revisorSimulador).subscribe((res) => {
          this.CloseModal('Revisor asignado exitosamente');
        });
        break;
    }

    // if(this.opcion === 'Mazo'){
    //   const revisor = {
    //     idMazo: this.id,
    //     idDocenteRevisor: idDocente
    //   }
    //   this.securityService.asignarRevisorMazo(revisor).subscribe((res) => {
    //     this.CloseModal('Revisor asignado exitosamente');      
    //   });
    // }else if(this.opcion === 'Recursos'){
    //   const revisor = {
    //     id: this.id,
    //     idDocenteRevisor: idDocente
    //   }
    //   this.securityService.asignarRevisorRecurso(revisor).subscribe((res) => {
    //     this.CloseModal('Revisor asignado exitosamente');
    //   });
    // }
    
    
  }

  cancelar() {
    this.dialogRef.close();
  }

  
  CloseModal(mensaje?: string) {
    this.dialogRef.close(mensaje);
  }


  //probando
  ngOnInit(): void {
    this.builderForm();
    this.revisors.valueChanges.subscribe({
      next: (res) => {
        if (res?.limit) {
          this.limit = Number(res?.limit);
        }
        if (res?.page) {
          this.page = Number(res?.page);
        }
        this.listaDocentesRevisores();
      },
    });
    this.listaDocentesRevisores();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['searchData']) {
      this.nombre = this.searchData?.question;
      this.listaDocentesRevisores();
    }
    if (changes['loadTable']) {
      if (this.loadTable) {
        this.listaDocentesRevisores();
      }
    }
  }
  pagination = {
    buttonLeft: true,
    buttonRight: true,
  };

  builderForm() {
    this.revisors = this.formBuilder.group({
      limit: [5],
      page: [1],
    });
    this.limit = this.revisors.get('limit')?.value;
    this.page = this.revisors.get('page')?.value;
  }

  changePage(newPage: number) {
    if (newPage !== this.page) {
      console.log('PASO');
      this.page = newPage;
      this.listaDocentesRevisores();
    }
  }
 

  listaDocentesRevisores() {
    const paginate: RevisorGetQuery = {
      page: this.page,
      limit: this.limit,
      nombre: this.nombre,
    };
   
    this.securityService.getDocRevisores(paginate).subscribe({
      next: (res: any) => {
        this.data = res.data ?? [];
        if (this.data.length > 0) {
          this.nombre = res.data.nombresCompletos;
          this.paginateCurrent = this.crearArreglo(this.limit, res.numRecord);
        }
        if (this.data?.length === 0 || !this.data) {
          this.paginateCurrent = [1];
        }
      },
      complete: () => {
        this.loadedTableEmitter.emit(false);
      },
    });
  }

  crearArreglo(limite: number, cant: number) {
    const rest = cant / limite;
    const elementos = Math.floor(rest);
    const arreglo = [];
    const more = rest - elementos;
    for (let i = 1; i <= elementos; i++) {
      arreglo.push(i);

      if (more > 0 && elementos === i) {
        arreglo.push(i + 1);
      }
      this.pagination.buttonLeft = true;
      this.pagination.buttonRight = true;
    }
    
    if (elementos > 0) {
      if (arreglo?.length === this.page) {
        this.pagination.buttonRight = false;
      }
      if (1 === this.page) {
        this.pagination.buttonLeft = false;
      }
    }

    if (elementos === 0) {
      this.pagination.buttonLeft = false;
      this.pagination.buttonRight = false;
      arreglo.push(1);
    }
    return arreglo;
  }


  prevPage() {
    if (this.pagination.buttonLeft) {
      const leftButton = this.revisors.get('page')?.value;
      this.revisors.get('page')?.setValue(leftButton - 1);
    }
  }

  nextPage() {
    if (this.pagination.buttonRight) {
      const rightButton = this.revisors.get('page')?.value;
      this.revisors.get('page')?.setValue(rightButton + 1);
    }
  }

  
  
}
