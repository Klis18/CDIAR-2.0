import { Component, Inject } from '@angular/core';
import { LearnService } from '../../services/learn.service';
import { MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { updateFlashcard } from '../../interfaces/mazo.interface';

@Component({
  selector: 'app-edit-flashcard',
  templateUrl: './edit-flashcard.component.html',
  styles: ``
})
export class EditFlashcardComponent {
  flashcardGroupForm!: FormGroup;
  isDisabled: boolean = this.data.isDisabled;
  idFlashcard: number = this.data.id;
  title: string = this.data.titulo;

  constructor(private learnService: LearnService,  
              @Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<EditFlashcardComponent>) {}

  ngOnInit() {
    this.flashcardGroupForm = new FormGroup({
      pregunta: new FormControl('', [
        Validators.required
      ]),
      respuesta: new FormControl('', [
        Validators.required
      ])
    });

    this.getFlashcard(this.idFlashcard);
  }

  getFlashcard(idFlashcard: number) {
    this.learnService.getFlashcard(idFlashcard).subscribe((res) => {
      console.log('Flashcard:', res); // Depuración
      this.flashcardGroupForm.setValue({
        pregunta: res.data.pregunta,
        respuesta: res.data.respuesta
      });
    });
  }  

  saveFlashcard() {
    const flashcard: updateFlashcard = {
      idFlashcard: this.idFlashcard,
      pregunta: this.flashcardGroupForm.value.pregunta,
      respuesta: this.flashcardGroupForm.value.respuesta
    };

    this.learnService.updateFlashcard(flashcard).subscribe(
      (response) => {
        // manejar la respuesta exitosa
        console.log('Response:', response);
        this.isDisabled = true;
      },
      (error) => {
        // manejar el error
        console.error('Error:', error);
      }
    );
  }

  editar() {
    this.isDisabled = !this.isDisabled;
  }

  cancelar() {
    this.dialogRef.close();
  }
}
