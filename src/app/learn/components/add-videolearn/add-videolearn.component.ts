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
  datosVideolearn!:any;
  validForm:boolean = false;
  asignaturas: { label: string; value: string }[] = [];

  constructor(private videolearnService:VideolearnService,
              private dialogRef: MatDialogRef<AddVideolearnComponent>
  ) {}
  
  saveVideoLearn(){
    if(!this.validForm){
      console.log('DATOS RECURSOS: ', this.datosVideolearn);
      return;
    }
  
    const videolearn: addVideolearn = {
      idNivel: this.datosVideolearn.idNivel,
      idAsignatura: this.datosVideolearn.idAsignatura,
      nombreVideoLearn: this.datosVideolearn.nombreVideoLearn,
      enlaceVideo: this.datosVideolearn.enlaceVideo,
    }
    
    console.log('Videolearn: ', videolearn);
    this.videolearnService.addVideolearn(videolearn)
    .subscribe((res) => {
      this.CloseModal(res.statusCode.toString())
    });

    
  }

  getData(events:any){
    this.datosVideolearn = events;
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
