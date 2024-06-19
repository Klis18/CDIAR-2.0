import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RecursoEdit } from '../../interfaces/recurso.interface';
import { RecursoService } from '../../services/recurso.service';

@Component({
  selector: 'app-edit-resource',
  templateUrl: './edit-resource.component.html',
  styles: ``,
})
export class EditResourceComponent {
  nivelesType: { label: string; value: string }[] = [];
  asignaturas: { label: string; value: string }[] = [];
  estados: { label: string; value: string }[] = [];
  recursoFile: string | null = null;
  extension: string = '';
  datosRecursos!: any;
  editaDataRecurso!: any;
  idRecurso!: number;
  validForm: boolean = true;

  constructor(
    private recursoService: RecursoService,
    public dialogRef: MatDialogRef<EditResourceComponent>,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  tituloForm: string = this.data.titulo;

  ngOnInit() {
    this.getRecurso(this.data.id);
    console.log(this.data.id);
  }

  getRecurso(idRecurso: number) {
    console.log('RECURSO ID: ', idRecurso);

    this.recursoService.getRecurso(idRecurso).subscribe((res: any) => {
      console.log(res);
      this.datosRecursos = res.data;
    });
  }

  saveRecurso() {
    if (!this.validForm) {
      console.log('Debe completar todos los campos para continuar.');
      return;
    }

    const recursosEdit: RecursoEdit = {
      idRecurso: this.editaDataRecurso.idRecurso,
      idNivel: Number(this.editaDataRecurso.idNivel),
      idAsignatura: Number(this.editaDataRecurso.idAsignatura),
      idEstado: this.editaDataRecurso.idEstado,
      tipoRecurso: this.editaDataRecurso.tipoRecurso,
      enlaceDelRecurso: this.editaDataRecurso.enlaceDelRecurso,
      nombreRecurso: this.editaDataRecurso.nombreRecurso,
      idDocenteRevisor: this.editaDataRecurso.idDocenteRevisor,
      observacion: this.editaDataRecurso.observacion,
      observacionesArchivo: this.editaDataRecurso.observacionesArchivo,
      recurso: this.editaDataRecurso?.recurso,
      extension: this.editaDataRecurso?.extension,
    };

    if (recursosEdit?.tipoRecurso === 'Link') {
      recursosEdit.recurso = null;
      recursosEdit.extension = null;
    } else {
      recursosEdit.enlaceDelRecurso = null;
    }
    console.log('AQUI:', {
      recursosEdit,
      editaDataRecurso: this.editaDataRecurso,
    });

    this.recursoService.editarRecurso(recursosEdit).subscribe((res) => {
      console.log('recurso editado');
      this.CloseModal('recurso editado');
    });
  }

  getData(events: any) {
    this.editaDataRecurso = events;
  }

  getValidForm(event: any) {
    this.validForm = event;
  }

  updateAsignatura(event: any) {
    console.log('EVENTO ASIGNATURA: ', event);
    this.asignaturas = event;
  }
  cancelar() {
    this.dialogRef.close();
  }

  CloseModal(mensaje?: string) {
    this.dialogRef.close(mensaje);
  }
}
