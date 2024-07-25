import { Component, Inject, OnInit } from '@angular/core';
import { VideolearnService } from '../../services/videolearn.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { editVideoLearn, getVideolearn } from '../../interfaces/videolearn.interface';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { CardMessageComponent } from '../../../shared/pages/card-message/card-message.component';

@Component({
  selector: 'app-edit-videolearn',
  templateUrl: './edit-videolearn.component.html',
  styles: ``
})
export class EditVideolearnComponent implements OnInit{

  nivelesType: { label: string; value: string }[] = [];
  asignaturas: { label: string; value: string }[] = [];
  estados: { label: string; value: string }[] = [];
  datosVideolearn!:any;
  editaDataVideolearn!: any;
  validForm:boolean = true;

  constructor(private videolearnService:VideolearnService,
              private spinnerService: SpinnerService,
              private dialog: MatDialog,
              private dialogRef: MatDialogRef<EditVideolearnComponent>,

              @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  tituloForm: string = this.data.titulo;

  ngOnInit(){
    this.getVideolearn(this.data.id);
  }
  
  getVideolearn(idVideoLearn:number){
    this.videolearnService.getVideoLearn(idVideoLearn).subscribe((res: any) => {
      this.datosVideolearn = res.data;
    });
  }

    saveVideoLearn(){
      if(!this.validForm){
        return;
    }
  
    const videolearnEdit: editVideoLearn = {
      nombreVideoLearn: this.datosVideolearn.nombreVideoLearn,
      idNivel: this.datosVideolearn.idNivel,
      idAsignatura: this.datosVideolearn.idAsignatura,
      idVideoLearn: this.data.id,
      enlaceVideo: this.datosVideolearn.enlaceVideo,
    }
    
    this.spinnerService.showSpinner();


    this.videolearnService.updateVideolearn(videolearnEdit).subscribe((res) => {
      this.spinnerService.hideSpinner();

      this.CloseModal(res.statusCode.toString())
    },
    (error) => {
        this.spinnerService.hideSpinner();
        this.dialog.open(CardMessageComponent, {
          width: '80%',
          maxWidth: '500px',
          maxHeight: '80%',
          data: {status:'error', mensaje: 'Error al editar el videolearn, por favor intente de nuevo.'},
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
