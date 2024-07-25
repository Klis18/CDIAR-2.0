import { Component, Inject} from '@angular/core';
import { LearnService } from '../../services/learn.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { CardMessageComponent } from '../../../shared/pages/card-message/card-message.component';

@Component({
  selector: 'app-add-question-flashcard',
  templateUrl: './add-question-flashcard.component.html',
  styles: ``
})
export class AddQuestionFlashcardComponent{
  
  datosFlashcardAdd!:any;
  validForm:boolean=false;
  idMazo: number = this.data.id;

  constructor(private learnService:LearnService,
              private spinnerService: SpinnerService,
              private dialog: MatDialog,
              private dialogRef: MatDialogRef<AddQuestionFlashcardComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any
  ) {}


  saveFlashcard(){    
    const payload = {
      flashcards: this.datosFlashcardAdd
    }
    this.spinnerService.showSpinner();

    this.learnService.addFlashcard(payload).subscribe((res) => {
      this.spinnerService.hideSpinner();
      this.CloseModal(res.statusCode.toString());
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
  
  CloseModal(mensaje?:string){
    this.dialogRef.close(mensaje);
  }
  
  getFlashcardAdd(datos:string[]){
    this.datosFlashcardAdd = datos; 
  }
      
  getValidForm(event:any){
    this.validForm = event;
  }
      
  cancelar() {
    this.dialogRef.close();
  }


}
