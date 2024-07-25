import { Component } from '@angular/core';
import { LearnService } from '../../services/learn.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NewMazo } from '../../interfaces/mazo.interface';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { CardMessageComponent } from '../../../shared/pages/card-message/card-message.component';

@Component({
  selector: 'app-generate-mazo',
  templateUrl: './generate-mazo.component.html',
  styles: ``
})
export class GenerateMazoComponent {
  datosMazo!:any;
  validForm:boolean = false;
  asignaturas: { label: string; value: string }[] = [];

  constructor(private learnService:LearnService,
              private spinnerService: SpinnerService,
              private dialog: MatDialog,
              private dialogRef: MatDialogRef<GenerateMazoComponent>
  ) {}
  
  saveMazo(){
    if(!this.validForm){
      console.log('DATOS RECURSOS: ', this.datosMazo);
      return;
    }
  
    const mazo: NewMazo = {
      idNivel: this.datosMazo.idNivel,
      idAsignatura: this.datosMazo.idAsignatura,
      nombreMazo: this.datosMazo.nombreMazo,
    }
    
    this.spinnerService.showSpinner();
    this.learnService.generarFlashcardsIa(mazo).subscribe((res) => {
      this.spinnerService.hideSpinner();
      this.CloseModal(res.statusCode.toString());
    },
    (error) => {
        this.spinnerService.hideSpinner();
        this.dialog.open(CardMessageComponent, {
          width: '80%',
          maxWidth: '500px',
          maxHeight: '80%',
          data: {status:'error', mensaje: 'Error al generar flashcards, por favor intente de nuevo.'},
        });
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
    this.asignaturas = event;
  }
   cancelar() {
    this.dialogRef.close();
  }
}
