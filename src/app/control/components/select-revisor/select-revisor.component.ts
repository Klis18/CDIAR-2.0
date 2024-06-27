import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-select-revisor',
  templateUrl: './select-revisor.component.html',
  styles: ``
})
export class SelectRevisorComponent {

  searchInfo:any;

  constructor(private dialogRef: MatDialogRef<SelectRevisorComponent>) { }

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
