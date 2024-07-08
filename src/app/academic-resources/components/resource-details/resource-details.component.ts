import { Component, Inject } from '@angular/core';
import { RecursoService } from '../../services/recurso.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { approveResource } from '../../interfaces/recurso.interface';
import { ObservacionRechazoComponent } from '../../../shared/pages/observacion-rechazo/observacion-rechazo.component';

@Component({
  selector: 'app-resource-details',
  templateUrl: './resource-details.component.html',
  styles: ``
})
export class ResourceDetailsComponent {
  datosRecurso!: any;
  nivel!: string;
  asignatura!: string;
  // tipoRecurso!: string;
  // enlaceRecurso!: string;
  // recurso!: string;
  title!: string;
  opcion!: string;

  constructor(
    private recursoService: RecursoService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ResourceDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.getDetailRecurso(this.data.id);
    console.log(this.getDetailRecurso(this.data.id))
    this.nivel = this.data.nivel;
    this.asignatura = this.data.asignatura;
    this.opcion = this.data.opcion;
    this.changeTitle();
  }

  
  getDetailRecurso(idRecurso: number) {
    this.recursoService.getRecurso(idRecurso).subscribe((res: any) => {
      this.datosRecurso = res.data;
      console.log(this.datosRecurso)
    });
  }

  cancelar() {
    this.dialogRef.close();
  }
  
  changeStatusResource(idStatus: number){
    const recurso: approveResource = {
      idRecurso: this.data.id,
      idEstado: idStatus
    
    };
    this.recursoService.changeStatusResource(recurso).subscribe((res) => {
      console.log(res);
      this.dialogRef.close();
    });
  }

  reprobarRecurso() {
    this.dialog.open(ObservacionRechazoComponent, {
      width: '55%',
      maxHeight: '90%',
      data: {id: this.data.id, opcion: 'recurso'},
    });
    this.dialogRef.close();
  }


  openFileInTab(): string {
    let urlRecurso: string = '';

    if (this.datosRecurso.tipoRecurso === 'Link') {
      urlRecurso = this.datosRecurso.enlaceDelRecurso;
    } else if (
      this.datosRecurso.tipoRecurso === 'Archivo' ||
      this.datosRecurso.tipoRecurso === 'Imagen'
    ) {
      urlRecurso = this.datosRecurso.recurso;
    }
    return urlRecurso;
  }

  changeTitle(){
    if(this.opcion === 'approve'){
      this.title = 'Aprobar Recurso';
  }else{
      this.title = 'Detalle Recurso';
    }
  }

  
}
