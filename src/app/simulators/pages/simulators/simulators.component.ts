import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HomeService } from '../../../home/services/home.service';
import { AddSimulatorComponent } from '../../components/add-simulator/add-simulator.component';
import { GenerateSimulatorComponent } from '../../components/generate-simulator/generate-simulator.component';

@Component({
  selector: 'app-simulators',
  templateUrl: './simulators.component.html',
  styles: ``
})
export class SimulatorsComponent implements OnInit{

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

  agregarSimulador() {
    const dialogRef = this.dialog.open(AddSimulatorComponent, {
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

  generarSimulador() {
    const dialogRef = this.dialog.open(GenerateSimulatorComponent, {
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
