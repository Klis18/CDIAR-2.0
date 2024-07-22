import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CargaHorariaDocenteService } from '../../services/carga-horaria-docente.service';

@Component({
  selector: 'app-add-carga-horaria',
  templateUrl: './add-carga-horaria.component.html',
  styles: ``
})
export class AddCargaHorariaComponent {
  datosCargaAdd!:any;
  validForm:boolean=false;
  // idMazo: number = this.data.id;
  constructor(private cargaHorariaService:CargaHorariaDocenteService,
              private dialogRef: MatDialogRef<AddCargaHorariaComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any
  ) {}


  saveCarga(){    
    const payload = {
      cargaHoraria: this.datosCargaAdd
    }
    
    this.cargaHorariaService.addCargaHoraria(payload).subscribe((res) => {
      this.CloseModal(res.statusCode.toString());
    });
    
    // this.learnService.addFlashcard(payload).subscribe((res) => {
    //   this.CloseModal(res.statusCode.toString());
    // });
  }
  
  CloseModal(mensaje?:string){
    this.dialogRef.close(mensaje);
  }
  
  getCargaAdd(datos:string[]){
    this.datosCargaAdd = datos;
    // console.log('Datos Flashcard Add: ', this.datosFlashcardAdd);
    // console.log('longitud flashcard: ', this.datosFlashcardAdd.length);   
  }
      
  getValidForm(event:any){
    this.validForm = event;
  }
      
  cancelar() {
    this.dialogRef.close();
  }
}
