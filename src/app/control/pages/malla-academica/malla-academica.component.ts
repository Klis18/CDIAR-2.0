import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddMallaAcademicaComponent } from '../../components/add-malla-academica/add-malla-academica.component';

@Component({
  selector: 'app-malla-academica',
  templateUrl: './malla-academica.component.html',
  styles: ``
})
export class MallaAcademicaComponent {

  idNivel: number = 0;
  idAsignatura: number = 0;
  searchInfo: any;
  selectedTab:string='Niveles';

  constructor(public dialog: MatDialog) {}


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

  agregarMalla() {
    const dialogRef = this.dialog.open(AddMallaAcademicaComponent, {
      width: '40%',
      maxHeight: '80%',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadTable();
      }
    });
  }

}
