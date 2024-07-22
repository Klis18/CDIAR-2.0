import { Component } from '@angular/core';
import { SecurityService } from '../../services/security.service';
import { MatDialogRef } from '@angular/material/dialog';
import { addAsignatura, addNivel, mallaAcademica } from '../../interfaces/malla-academica.interface';

@Component({
  selector: 'app-add-malla-academica',
  templateUrl: './add-malla-academica.component.html',
  styles: ``
})
export class AddMallaAcademicaComponent {
  datos!: any;
  validForm: boolean = false;
  tipoRegistro: number = 0;

  constructor(
    private securityService: SecurityService,
    private dialogRef: MatDialogRef<AddMallaAcademicaComponent>
  ) {}

  saveMallaAcademica() {
    if (!this.validForm) {
      return;
    }
    if (this.datos.tipoRegistro === '1') {
      const nivel: addNivel = {
        descripcion: this.datos.descripcion,
      };

      this.securityService.addNivel(nivel).subscribe((res) => {
        this.CloseModal(res.statusCode.toString());
      });
    }else if (this.datos.tipoRegistro === '2') {
      const asignatura: addAsignatura = {
        idNivel: this.datos.idNivel,
        nombre: this.datos.nombre,
      };
      this.securityService.addAsignatura(asignatura).subscribe((res) => {
        this.CloseModal(res.statusCode.toString());
      });
    }
  }

  getData(events: any) {
    this.datos = events;
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
