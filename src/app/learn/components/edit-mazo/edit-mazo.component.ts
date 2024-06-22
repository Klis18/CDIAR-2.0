import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LearnService } from '../../services/learn.service';
import { EditMazo } from '../../interfaces/mazo.interface';

@Component({
  selector: 'app-edit-mazo',
  templateUrl: './edit-mazo.component.html',
  styles: ``
})
export class EditMazoComponent implements OnInit{
  nivelesType: { label: string; value: string }[] = [];
  asignaturas: { label: string; value: string }[] = [];
  estados: { label: string; value: string }[] = [];
  datosMazo!:any;
  editaDataMazo!: any;
  validForm:boolean = true;

  constructor(private learnService:LearnService,
              private dialogRef: MatDialogRef<EditMazoComponent>,

              @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  tituloForm: string = this.data.titulo;

  ngOnInit(){
    this.getMazo(this.data.id);
  }
  
  getMazo(idMazo:number){
    this.learnService.getDatosMazo(idMazo).subscribe((res: any) => {
      this.datosMazo = res.data;
    });
  }

    saveMazo(){
      if(!this.validForm){
        return;
    }
  
    const mazoEdit: EditMazo = {
      nombreMazo: this.datosMazo.nombreMazo,
      idNivel: this.datosMazo.idNivel,
      idAsignatura: this.datosMazo.idAsignatura,
      idMazo: this.datosMazo.idMazo,
    }
    
    this.learnService.editMazo(mazoEdit)
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
    this.asignaturas = event;
  }
   cancelar() {
    this.dialogRef.close();
  }
}
