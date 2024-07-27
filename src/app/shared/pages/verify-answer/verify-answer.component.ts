import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-verify-answer',
  templateUrl: './verify-answer.component.html',
  styles: ``
})
export class VerifyAnswerComponent {

  imagen = this.data.imagen;
  mensaje = this.data.mensaje;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ){}

}
