import { Component, Inject } from '@angular/core';
import { RecursoService } from '../../services/recurso.service';
import { Recurso } from '../../interfaces/recurso.interface';
import {  MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { CardMessageComponent } from '../../../shared/pages/card-message/card-message.component';

@Component({
  selector: 'app-add-resource',
  templateUrl: './add-resource.component.html',
  styles: `

  `,
})
export class AddResourceComponent{
  datosRecursos!: any;
  validForm: boolean = false;
  asignaturas: { label: string; value: string }[] = [];

  constructor(
    private recursoService: RecursoService,
    private spinnerService: SpinnerService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<AddResourceComponent>
  ) {}

  saveRecurso() {
    if (!this.validForm) {
      return;
    }

    const recursos: Recurso = {
      idNivel: this.datosRecursos.idNivel,
      idAsignatura: this.datosRecursos.idAsignatura,
      tipoRecurso: this.datosRecursos.tipoRecurso,
      nombreRecurso: this.datosRecursos.nombreRecurso,
      enlaceDelRecurso: this.datosRecursos.enlaceDelRecurso,
      recurso: this.datosRecursos.recurso,
      extension: this.datosRecursos.extension,
    };

    if (recursos?.tipoRecurso === 'Link') {
      recursos.recurso = null;
      recursos.extension = null;
    } else {
      recursos.enlaceDelRecurso = null;
    }
    this.spinnerService.showSpinner();

    this.recursoService.addRecurso(recursos).subscribe((res) => {
      this.spinnerService.hideSpinner();
      this.CloseModal(res.statusCode.toString());
    },
    (error) => {
        this.spinnerService.hideSpinner();
        this.dialog.open(CardMessageComponent, {
          width: '80%',
          maxWidth: '500px',
          maxHeight: '80%',
          data: {status:'error', mensaje: 'Error al guardar el recursos, por favor intente de nuevo.'},
        });
      });
  }

  getData(events: any) {
    this.datosRecursos = events;
  }

  CloseModal(mensaje?: string) {
    this.dialogRef.close(mensaje);
  }

  getValidForm(event: any) {
    this.validForm = event;
  }

  updateAsignatura(event: any) {
    this.asignaturas = event;
  }
  cancelar() {
    this.dialogRef.close();
  }
}
