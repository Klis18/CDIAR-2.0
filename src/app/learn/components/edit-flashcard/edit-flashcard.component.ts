import { Component, Inject } from '@angular/core';
import { LearnService } from '../../services/learn.service';
import { MAT_DIALOG_DATA,MatDialog,MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { updateFlashcard } from '../../interfaces/mazo.interface';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { CardMessageComponent } from '../../../shared/pages/card-message/card-message.component';

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
              private spinnerService: SpinnerService,
              private dialog: MatDialog,
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
    this.spinnerService.showSpinner();

    this.learnService.updateFlashcard(flashcard).subscribe(
      (response) => {
        this.spinnerService.hideSpinner();
        this.isDisabled = true;
      },
      (error) => {
        this.spinnerService.hideSpinner();
        this.dialog.open(CardMessageComponent, {
          width: '80%',
          maxWidth: '500px',
          maxHeight: '80%',
          data: {status:'error', mensaje: 'Error al editar la flashcard, por favor intente de nuevo.'},
        });
      });
    this.dialogRef.close();
  }

  editar() {
    this.isDisabled = !this.isDisabled;
  }

  cancelar() {
    this.dialogRef.close();
  }
}
