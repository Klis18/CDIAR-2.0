import { Component } from '@angular/core';

@Component({
  selector: 'app-aprobar-docentes',
  templateUrl: './aprobar-docentes.component.html',
  styles: ``
})
export class AprobarDocentesComponent {
  searchInfo: any;
  
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
}
