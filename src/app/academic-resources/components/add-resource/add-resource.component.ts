import { Component, Inject } from '@angular/core';
import { RecursoService } from '../../services/recurso.service';
import { Recurso } from '../../interfaces/recurso.interface';
import {  MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-resource',
  templateUrl: './add-resource.component.html',
  styles: `

  `,
})
export class AddResourceComponent{
  datosRecursos!:any;
  validForm:boolean = true;
  asignaturas: { label: string; value: string }[] = [];

  constructor(private recursoService:RecursoService,
              private dialogRef: MatDialogRef<AddResourceComponent>
  ) {}
  
  saveRecurso(){
    if(!this.validForm){
      console.log('DATOS RECURSOS: ', this.datosRecursos);
      return;
    }
  
    const recursos: Recurso = {
      idNivel: this.datosRecursos.idNivel,
      idAsignatura: this.datosRecursos.idAsignatura,
      tipoRecurso: this.datosRecursos.tipoRecurso,
      nombreRecurso: this.datosRecursos.nombreRecurso,
      enlaceDelRecurso: this.datosRecursos.enlaceDelRecurso,
      recurso: this.datosRecursos.recurso,
      extension: this.datosRecursos.extension
    };

    if (recursos?.tipoRecurso === 'Link') {
      recursos.recurso = null;
      recursos.extension = null;
    } else {
      recursos.enlaceDelRecurso = null;
    }

    
    console.log('RECURSO: ', {recursos, datosRecursos: this.datosRecursos});

    this.recursoService.addRecurso(recursos)
    .subscribe((res) => {
      this.CloseModal(res.statusCode.toString())
    });

    
  }

  getData(events:any){
    this.datosRecursos = events;
  }

  CloseModal(mensaje?:string){
    this.dialogRef.close(mensaje);
  }

  getValidForm(event:any){
    this.validForm = event;
  }

  updateAsignatura(event: any) {
    console.log('EVENTO ASIGNATURA: ', event);
    this.asignaturas = event;
  }
   cancelar() {
    this.dialogRef.close();
  }
}
