import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModeFormsResources, RecursoEdit } from '../../interfaces/recurso.interface';
import { RecursoService } from '../../services/recurso.service';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { CardMessageComponent } from '../../../shared/pages/card-message/card-message.component';

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
  validForm: boolean = false;

  constructor(
    private recursoService: RecursoService,
    private spinnerService: SpinnerService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<EditResourceComponent>,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  tituloForm: string = this.data.titulo;

  ngOnInit() {
    this.getRecurso(this.data.id);
    switch (this.data.typeModal) {
      case 'Por Aprobar':
        this.modeForm = 'Por Aprobar';
        break;
      case 'Asignar Revisor':
        this.modeForm = 'Asignar Revisor';
        break;
      default:
        this.modeForm = 'Edit';

        break;
    }
  }
  public modeForm!: ModeFormsResources;

  getRecurso(idRecurso: number) {
    this.recursoService.getRecurso(idRecurso).subscribe((res: any) => {
      this.datosRecursos = res.data;
    });
  }

  saveRecurso() {
    if (!this.validForm) {
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
      observacion: this.editaDataRecurso.observation,
      observacionesArchivo: this.editaDataRecurso.observacionesArchivo,
      extensionObservaciones: this.editaDataRecurso.extensionObservaciones,
      recurso: this.editaDataRecurso?.recurso,
      extension: this.editaDataRecurso?.extension,
    };

    if (recursosEdit?.tipoRecurso === 'Link') {
      recursosEdit.recurso = null;
      recursosEdit.extension = null;
    } else {
      recursosEdit.enlaceDelRecurso = null;
    }

    this.spinnerService.showSpinner();
    
    this.recursoService.editarRecurso(recursosEdit).subscribe((res) => {
      this.spinnerService.hideSpinner();
      this.cambiarEstado();
      this.CloseModal('Recurso editado');
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

  cambiarEstado(){
    const changeStatus = {
      idRecurso: this.editaDataRecurso.idRecurso,
      idEstado: 1,
    };
    this.recursoService.changeStatusResource(changeStatus).subscribe((res) => {
    });
  }

  getData(events: any) {
    this.editaDataRecurso = events;
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

  CloseModal(mensaje?: string) {
    this.dialogRef.close(mensaje);
  }
}
