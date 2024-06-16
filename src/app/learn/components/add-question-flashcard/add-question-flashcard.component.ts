import { Component, Inject, Input } from '@angular/core';
import { LearnService } from '../../services/learn.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-question-flashcard',
  templateUrl: './add-question-flashcard.component.html',
  styles: ``
})
export class AddQuestionFlashcardComponent{
  datosFlashcard!:any;
  datosFlashcardAdd!:any;
  validForm:boolean = true;
  asignaturas: { label: string; value: string }[] = [];
  idMazo: number = this.data.id;

  constructor(private learnService:LearnService,
              private dialogRef: MatDialogRef<AddQuestionFlashcardComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  
  saveFlashcard(){
    // if(!this.validForm){
    //   console.log('DATOS Flashcard: ', this.datosFlashcardAdd);
    //   return;
    // }

    console.log('DATOS Flashcard: ', this.datosFlashcardAdd);

// debugger
    const payload = {
      flashcards: this.datosFlashcardAdd
    }
    
  
    this.learnService.addFlashcard(payload).subscribe((res) => {
      this.CloseModal(res.statusCode.toString());
    });
    
  }

  // getData(events:any){
  //   this.datosFlashcard = events;
  // }

  CloseModal(mensaje?:string){
    this.dialogRef.close(mensaje);
  }

  getValidForm(event:any){
    this.validForm = event;
  }

   cancelar() {
    this.dialogRef.close();
  }

  getFlashcardAdd(datos:string[]){
    this.datosFlashcardAdd = datos;
    console.log('Datos Flashcard Add: ', this.datosFlashcardAdd);
  }
}
