import { Component } from '@angular/core';
import { VideolearnService } from '../../services/videolearn.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { addVideolearn } from '../../interfaces/videolearn.interface';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { CardMessageComponent } from '../../../shared/pages/card-message/card-message.component';

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
              private spinnerService: SpinnerService,
              private dialog: MatDialog,
              private dialogRef: MatDialogRef<AddVideolearnComponent>
  ) {}
  
  saveVideoLearn(){
    if(!this.validForm){
      return;
    }
  
    const videolearn: addVideolearn = {
      idNivel: this.datosVideolearn.idNivel,
      idAsignatura: this.datosVideolearn.idAsignatura,
      nombreVideoLearn: this.datosVideolearn.nombreVideoLearn,
      enlaceVideo: this.datosVideolearn.enlaceVideo,
    }
    this.spinnerService.showSpinner();

    this.videolearnService.addVideolearn(videolearn)
    .subscribe((res) => {
      this.spinnerService.hideSpinner();

      this.CloseModal(res.statusCode.toString())
    },
    (error) => {
        this.spinnerService.hideSpinner();
        this.dialog.open(CardMessageComponent, {
          width: '80%',
          maxWidth: '500px',
          maxHeight: '80%',
          data: {status:'error', mensaje: 'Error al guardar el recursos, por favor intente de nuevo.'},
        });
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
    this.asignaturas = event;
  }
   cancelar() {
    this.dialogRef.close();
  }
}
