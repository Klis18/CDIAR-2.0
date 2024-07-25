import { Component, OnInit } from '@angular/core';
import { AddMetaComponent } from '../../components/add-meta/add-meta.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-metas',
  templateUrl: './metas.component.html',
  styles: ``
})
export class MetasComponent implements OnInit {
  searchInfo: any;
  reloadTable: boolean = false;

  constructor(public dialog: MatDialog) {}


  ngOnInit() {}

  emitSearch(res: any) {
    if (res) {
      this.searchInfo = res;
    }
  }

  loadTable() {
    this.reloadTable = true;
  }

  loadedTale() {
    this.reloadTable = false;
  }

  agregarMeta() {
    const dialogRef = this.dialog.open(AddMetaComponent, {
      width: '50%',
      maxHeight: '80%',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadTable();
      }
    });
  }
}
