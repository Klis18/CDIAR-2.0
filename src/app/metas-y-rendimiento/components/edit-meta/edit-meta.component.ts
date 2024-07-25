import { Component, Inject } from '@angular/core';
import { MetasYRendimientoService } from '../../services/metas-y-rendimiento.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { getMeta, updateMeta } from '../../interfaces/metas.interface';

@Component({
  selector: 'app-edit-meta',
  templateUrl: './edit-meta.component.html',
  styles: ``
})
export class EditMetaComponent {
  nivelesType: { label: string; value: string }[] = [];
  asignaturas: { label: string; value: string }[] = [];
  datos!: any;
  editaDataMeta!: any;
  idRecurso!: number;
  validForm: boolean = false;
  id: number = this.data.id;
  disabled: boolean = this.data.isDisabled;

  constructor(
    private metaService: MetasYRendimientoService,
    public dialogRef: MatDialogRef<EditMetaComponent>,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  tituloForm: string = this.data.titulo;

  ngOnInit() {
    this.getMeta(this.data.id);
  }

  getMeta(idMeta: number) {
    this.metaService.getMeta(idMeta).subscribe((res: any) => {
      this.datos = res.data;
    });
  }


  saveMeta() {
    if (!this.validForm) {
      return;
    }

    const metaEdit: updateMeta = {
      idMeta: this.id,
      idAsignatura: this.editaDataMeta.idAsignatura,
      idNivel: this.editaDataMeta.idNivel,
      calificacionPrimerParcial: this.editaDataMeta.calificacionPrimerParcial,
      puntajeObjetivo: this.editaDataMeta.puntajeObjetivo,
      calificacionSegundoParcial: this.editaDataMeta.calificacionSegundoParcial,
    };
      
    console.log('EDIT META',metaEdit);
    this.metaService.editMeta(metaEdit).subscribe((res) => {
      this.CloseModal(res.statusCode.toString());
    });
   
  }


  getData(events: any) {
    this.editaDataMeta = events;
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
