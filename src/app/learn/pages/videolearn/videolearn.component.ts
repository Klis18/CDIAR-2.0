import { Component, inject, OnInit } from '@angular/core';
import { HomeService } from '../../../home/services/home.service';
import { MatDialog } from '@angular/material/dialog';
import { AddVideolearnComponent } from '../../components/add-videolearn/add-videolearn.component';

@Component({
  selector: 'app-videolearn',
  templateUrl: './videolearn.component.html',
  styles: ``
})
export class VideolearnComponent implements OnInit {
  usuario: string = '';
  rol: string = '';
  selectedTab = 'Publicado';
  searchInfo: any;

  private homeService = inject(HomeService);

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    this.homeService.obtenerDatosMenu().subscribe((user) => {
      console.log(user);
      this.usuario = user.data.userName;
      this.rol = user.data.rol;
    });
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
    const dialogRef = this.dialog.open(AddVideolearnComponent, {
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
