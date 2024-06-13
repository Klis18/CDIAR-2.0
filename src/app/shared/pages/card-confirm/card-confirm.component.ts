import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ResourcesTableComponent } from '../../../academic-resources/components/resources-table/resources-table.component';

@Component({
  selector: 'app-card-confirm',
  templateUrl: './card-confirm.component.html',
  styles: ``
})
export class CardConfirmComponent {
  constructor( public dialog: MatDialogRef<CardConfirmComponent>, @Inject(MAT_DIALOG_DATA) public data: ResourcesTableComponent) {}

  cerrarDialogo(){
    this.dialog.close(false);
  }

  confirmado(){
    this.dialog.close(true);
  }

  ngOnInit() {}
}
