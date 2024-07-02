import { Component } from '@angular/core';

@Component({
  selector: 'app-edit-question-simulator',
  templateUrl: './edit-question-simulator.component.html',
  styles: ``
})
export class EditQuestionSimulatorComponent {
  // nivelesType: { label: string; value: string }[] = [];
  // asignaturas: { label: string; value: string }[] = [];
  // estados: { label: string; value: string }[] = [];
  // recursoFile: string | null = null;
  // extension: string = '';
  // datosRecursos!: any;
  // editaDataRecurso!: any;
  // idRecurso!: number;
  // validForm: boolean = false;

  // constructor(
  //   private recursoService: RecursoService,
  //   public dialogRef: MatDialogRef<EditResourceComponent>,

  //   @Inject(MAT_DIALOG_DATA) public data: any
  // ) {}

  // tituloForm: string = this.data.titulo;

  // ngOnInit() {
  //   this.getRecurso(this.data.id);
  //   switch (this.data.typeModal) {
  //     case 'Por Aprobar':
  //       this.modeForm = 'Por Aprobar';
  //       break;
  //     case 'Asignar Revisor':
  //       this.modeForm = 'Asignar Revisor';
  //       break;
  //     default:
  //       this.modeForm = 'Edit';

  //       break;
  //   }
  // }
  // public modeForm!: ModeFormsResources;

  // getRecurso(idRecurso: number) {
  //   this.recursoService.getRecurso(idRecurso).subscribe((res: any) => {
  //     this.datosRecursos = res.data;
  //   });
  // }

  // saveRecurso() {
  //   console.log({ editaDataRecurso: this.editaDataRecurso });
  //   if (!this.validForm) {
  //     return;
  //   }

  //   const recursosEdit: RecursoEdit = {
  //     idRecurso: this.editaDataRecurso.idRecurso,
  //     idNivel: Number(this.editaDataRecurso.idNivel),
  //     idAsignatura: Number(this.editaDataRecurso.idAsignatura),
  //     idEstado: this.editaDataRecurso.idEstado,
  //     tipoRecurso: this.editaDataRecurso.tipoRecurso,
  //     enlaceDelRecurso: this.editaDataRecurso.enlaceDelRecurso,
  //     nombreRecurso: this.editaDataRecurso.nombreRecurso,
  //     idDocenteRevisor: this.editaDataRecurso.idDocenteRevisor,
  //     observacion: this.editaDataRecurso.observation,
  //     observacionesArchivo: this.editaDataRecurso.observacionesArchivo,
  //     extensionObservaciones: this.editaDataRecurso.extensionObservaciones,
  //     recurso: this.editaDataRecurso?.recurso,
  //     extension: this.editaDataRecurso?.extension,
  //   };

  //   if (recursosEdit?.tipoRecurso === 'Link') {
  //     recursosEdit.recurso = null;
  //     recursosEdit.extension = null;
  //   } else {
  //     recursosEdit.enlaceDelRecurso = null;
  //   }

  //   this.recursoService.editarRecurso(recursosEdit).subscribe((res) => {
  //     this.CloseModal('recurso editado');
  //   });
  // }

  // getData(events: any) {
  //   this.editaDataRecurso = events;
  // }

  // getValidForm(event: any) {
  //   this.validForm = event;
  // }

  // updateAsignatura(event: any) {
  //   this.asignaturas = event;
  // }
  // cancelar() {
  //   this.dialogRef.close();
  // }

  // CloseModal(mensaje?: string) {
  //   this.dialogRef.close(mensaje);
  // }
}
