import { Component, Inject } from '@angular/core';
import { CargaHorariaDocenteService } from '../../services/carga-horaria-docente.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { updateCargaHoraria } from '../../interfaces/carga-horaria.interface';

@Component({
  selector: 'app-edit-carga-horaria',
  templateUrl: './edit-carga-horaria.component.html',
  styles: ``
})
export class EditCargaHorariaComponent {
  datosCargaAdd!:any;
  validForm:boolean=false;
  editaDataCarga!:any;
  id= this.data.id;
  idDocente= this.data.idDocente;
  constructor(private cargaHorariaService:CargaHorariaDocenteService,
              private dialogRef: MatDialogRef<EditCargaHorariaComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any
  ) {}


  ngOnInit() {
   this.getCargaHoraria(this.data.id);
  }

  getCargaHoraria(idCargaHoraria: number) {
    this.cargaHorariaService.listaCargaHorariaDiasSemana(idCargaHoraria).subscribe((res) => {
      this.datosCargaAdd = res.data;
    });
  }

  saveCarga(){    
    if(!this.validForm){
      return;
    }

    const cargaHoraria: updateCargaHoraria = {
      idCargaHoraria: this.id,
      idDocente: this.idDocente,
      diaSemana: this.editaDataCarga.diaSemana,
      actividad: this.editaDataCarga.actividad,
      horaDesde: this.editaDataCarga.horaDesde,
      horaHasta: this.editaDataCarga.horaHasta,
    }

    this.cargaHorariaService.updateCargaHoraria(cargaHoraria).subscribe((res) => {
      this.CloseModal('Carga Horaria Actualizada');
    });
    
  }
  
  CloseModal(mensaje?:string){
    this.dialogRef.close(mensaje);
  }
  
  getCargaAdd(events:any){
    this.editaDataCarga = events;
  }
      
  getValidForm(event:any){
    this.validForm = event;
  }
      
  cancelar() {
    this.dialogRef.close();
  }
}
