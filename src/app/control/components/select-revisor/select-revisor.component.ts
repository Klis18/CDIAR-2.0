import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-select-revisor',
  templateUrl: './select-revisor.component.html',
  styles: ``
})
export class SelectRevisorComponent {

  searchInfo:any;

  id = this.data.id;
  opcion = this.data.opcion;

  constructor(private dialogRef: MatDialogRef<SelectRevisorComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  emitSearch(res: any) {
    if (res) {
      this.searchInfo = res;
    }
  }
  reloadTable: boolean = false;


  loadTable() {
    this.reloadTable = true;
  }

  loadedTale() {
    this.reloadTable = false;
  }

  cancelar() {
    this.dialogRef.close();
  }
}
