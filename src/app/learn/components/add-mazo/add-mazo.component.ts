import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Recurso } from '../../../academic-resources/interfaces/recurso.interface';
import { LearnService } from '../../services/learn.service';
import { NewMazo } from '../../interfaces/mazo.interface';

@Component({
  selector: 'app-add-mazo',
  templateUrl: './add-mazo.component.html',
  styles: ``
})
export class AddMazoComponent {
  datosMazo!:any;
  validForm:boolean = true;
  asignaturas: { label: string; value: string }[] = [];

  constructor(private learnService:LearnService,
              private dialogRef: MatDialogRef<AddMazoComponent>
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
    
    console.log('Mazo: ', mazo);

    this.learnService.addMazo(mazo)
    .subscribe((res) => {
      this.CloseModal(res.statusCode.toString())
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
    console.log('EVENTO ASIGNATURA: ', event);
    this.asignaturas = event;
  }
   cancelar() {
    this.dialogRef.close();
  }
}
