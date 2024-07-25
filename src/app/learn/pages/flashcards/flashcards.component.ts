import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HomeService } from '../../../home/services/home.service';
import { AddMazoComponent } from '../../components/add-mazo/add-mazo.component';
import { GenerateMazoComponent } from '../../components/generate-mazo/generate-mazo.component';

@Component({
  selector: 'app-flashcards',
  templateUrl: './flashcards.component.html',
  styles: `

  `
})
export class FlashcardsComponent implements OnInit{
  usuario: string = '';
  rol: string = '';
  selectedTab = 'Publicado';
  searchInfo: any;

  private homeService = inject(HomeService);

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    this.homeService.obtenerDatosMenu().subscribe((user) => {
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

  agregarMazo() {
    const dialogRef = this.dialog.open(AddMazoComponent, {
      width: '80%',
      maxWidth: '500px',
      maxHeight: '80%',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadTable();
      }
    });
  }

  generarMazo(){
    const dialogRef = this.dialog.open(GenerateMazoComponent, {
      width: '80%',
      maxWidth: '500px',
      maxHeight: '80%',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadTable();
    }
    });
  }
}
