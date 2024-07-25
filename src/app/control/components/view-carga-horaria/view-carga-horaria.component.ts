import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, matDialogAnimations } from '@angular/material/dialog';

@Component({
  selector: 'app-view-carga-horaria',
  templateUrl: './view-carga-horaria.component.html',
  styles: ``
})
export class ViewCargaHorariaComponent implements OnInit {
  usuario: string = '';
  rol: string = '';
  selectedTab = 'Publicado';
  searchInfo: any;
  idDocente = this.data.idDocente;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    console.log('IDENTIFICACION DOCENTE' ,this.data.idDocente);
  }
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
