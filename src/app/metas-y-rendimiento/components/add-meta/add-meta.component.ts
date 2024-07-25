import { Component } from '@angular/core';
import { MetasYRendimientoService } from '../../services/metas-y-rendimiento.service';
import { MatDialogRef } from '@angular/material/dialog';
import { addMeta } from '../../interfaces/metas.interface';

@Component({
  selector: 'app-add-meta',
  templateUrl: './add-meta.component.html',
  styles: ``
})
export class AddMetaComponent {
  datos!: any;
  validForm: boolean = false;
  asignaturas: { label: string; value: string }[] = [];

  constructor(
    private metasService: MetasYRendimientoService,
    private dialogRef: MatDialogRef<AddMetaComponent>
  ) {}

  saveMeta() {
    if (!this.validForm) {
      return;
    }

    const meta: addMeta = {
      idNivel: this.datos.idNivel,
      idAsignatura: this.datos.idAsignatura,
      calificacionPrimerParcial: this.datos.calificacionPrimerParcial,
      puntajeObjetivo: this.datos.puntajeObjetivo,
    };

    console.log('ADD META', meta);

    this.metasService.addMeta(meta).subscribe((res) => {
      this.CloseModal(res.statusCode.toString());
    });


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

  updateAsignatura(event: any) {
    this.asignaturas = event;
  }
  cancelar() {
    this.dialogRef.close();
  }
}
