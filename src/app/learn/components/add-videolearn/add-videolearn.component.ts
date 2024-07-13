import { Component } from '@angular/core';
import { VideolearnService } from '../../services/videolearn.service';
import { MatDialogRef } from '@angular/material/dialog';
import { NewMazo } from '../../interfaces/mazo.interface';
import { addVideolearn } from '../../interfaces/videolearn.interface';

@Component({
  selector: 'app-add-videolearn',
  templateUrl: './add-videolearn.component.html',
  styles: ``
})
export class AddVideolearnComponent {
  datosMazo!:any;
  validForm:boolean = false;
  asignaturas: { label: string; value: string }[] = [];

  constructor(private videolearnService:VideolearnService,
              private dialogRef: MatDialogRef<AddVideolearnComponent>
  ) {}
  
  saveMazo(){
    if(!this.validForm){
      console.log('DATOS RECURSOS: ', this.datosMazo);
      return;
    }
  
    const videolearn: addVideolearn = {
      idNivel: this.datosMazo.idNivel,
      idAsignatura: this.datosMazo.idAsignatura,
      nombreVideoLearn: this.datosMazo.nombreMazo,
      enlaceVideo: this.datosMazo.enlaceVideo,
    }
    
    // console.log('Mazo: ', mazo);

    this.videolearnService.addVideolearn(videolearn)
    .subscribe((res) => {
      this.CloseModal(res.statusCode.toString())
    });

    
  }

  getData(events:any){
    this.datosMazo = events;
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
