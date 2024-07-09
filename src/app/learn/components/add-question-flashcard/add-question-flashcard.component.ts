import { Component, Inject} from '@angular/core';
import { LearnService } from '../../services/learn.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

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
              private dialogRef: MatDialogRef<AddQuestionFlashcardComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any
  ) {}


  saveFlashcard(){    
    const payload = {
      flashcards: this.datosFlashcardAdd
    }
    
    this.learnService.addFlashcard(payload).subscribe((res) => {
      this.CloseModal(res.statusCode.toString());
    });
  }
  
  CloseModal(mensaje?:string){
    this.dialogRef.close(mensaje);
  }
  
  getFlashcardAdd(datos:string[]){
    this.datosFlashcardAdd = datos;
    console.log('Datos Flashcard Add: ', this.datosFlashcardAdd);
    console.log('longitud flashcard: ', this.datosFlashcardAdd.length);   
  }
      
  getValidForm(event:any){
    this.validForm = event;
  }
      
  cancelar() {
    this.dialogRef.close();
  }


}
