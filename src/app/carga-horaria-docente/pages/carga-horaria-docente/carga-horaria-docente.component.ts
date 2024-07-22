import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HomeService } from '../../../home/services/home.service';
import { AddCargaHorariaComponent } from '../../components/add-carga-horaria/add-carga-horaria.component';

@Component({
  selector: 'app-carga-horaria-docente',
  templateUrl: './carga-horaria-docente.component.html',
  styles: ``
})
export class CargaHorariaDocenteComponent implements OnInit{
  usuario: string = '';
  rol: string = '';
  selectedTab = 'Publicado';
  searchInfo: any;

  private homeService = inject(HomeService);

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    // this.homeService.obtenerDatosMenu().subscribe((user) => {
    //   this.usuario = user.data.userName;
    //   this.rol = user.data.rol;
    // });
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

  openDialog() {
    const dialogRef = this.dialog.open(AddCargaHorariaComponent, {
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
