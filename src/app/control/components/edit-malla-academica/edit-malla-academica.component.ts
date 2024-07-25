import { Component, Inject, OnInit } from '@angular/core';
import { SecurityService } from '../../services/security.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { updateAsignatura, updateNivel } from '../../interfaces/malla-academica.interface';

@Component({
  selector: 'app-edit-malla-academica',
  templateUrl: './edit-malla-academica.component.html',
  styles: ``
})
export class EditMallaAcademicaComponent implements OnInit{
  datos!: any;
  validForm: boolean = false;
  tipoRegistro: number = 0;
  editaDataMalla!: any;
  tipoReg = this.data.tipo;
  id = this.data.id;

  constructor(
    private securityService: SecurityService,
    private dialogRef: MatDialogRef<EditMallaAcademicaComponent>,

    @Inject(MAT_DIALOG_DATA) public data: any

  ) {}

  ngOnInit() {

    if (this.data.tipo === '1') {
      this.getNivel(this.data.id);
    } else {
      this.getAsignatura(this.data.id);
    }
  }

  getNivel(idNivel: number) {
    this.securityService.getNivel(idNivel).subscribe((res: any) => {
      this.datos = res.data;
    });
  }

  getAsignatura(idAsignatura: number) {
    this.securityService.getAsignatura(idAsignatura).subscribe((res: any) => {
      this.datos = res.data;

      console.log('Datos de asignatura', res.data);
    });
  }

  saveMallaAcademica() {
    if (!this.validForm) {
      return;
    }
    console.log('Datos a guardar', this.datos);
    if (this.editaDataMalla.tipoRegistro === '1') {
      const nivel: updateNivel = {
        idNivel: this.id,
        descripcion: this.editaDataMalla.descripcion,
      };

      this.securityService.updateNivel(nivel).subscribe((res) => {
        console.log('Nivel actualizado correctamente', res);
        this.CloseModal(res.statusCode.toString());
      });
   
    }else if (this.editaDataMalla.tipoRegistro === '2') {
      const asignatura: updateAsignatura = {
        idNivel: this.editaDataMalla.idNivel,
        idAsignatura: this.id,
        nombre: this.editaDataMalla.nombre,
      };

      this.securityService.updateAsignatura(asignatura).subscribe((res) => {
        console.log('Asignatura actualizada correctamente', res);
        this.CloseModal(res.statusCode.toString());
      }) ;
    }
  }

  getData(events: any) {
    this.editaDataMalla = events;
  }

  CloseModal(mensaje?: string) {
    this.dialogRef.close(mensaje);
  }

  getValidForm(event: any) {
    this.validForm = event;
  }

  cancelar() {
    this.dialogRef.close();
  }
}
