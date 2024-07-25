import { Component, Inject, NgModule, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HomeService } from '../../../home/services/home.service';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-rendimiento',
  templateUrl: './rendimiento.component.html',
  styles: ``
})
export class RendimientoComponent implements OnInit{
  
  idNivel: number = 0;
  idAsignatura: number = 0;
  searchInfo: any;
  selectedTab:string='Simuladores';
  usuario!: string;

  constructor(public dialog: MatDialog, 
    @Inject(HomeService) private homeService: HomeService,
  ) {}

  ngOnInit(){
    this.homeService.obtenerDatosMenu().subscribe({
      next: (user) => {
        this.usuario = user.data.userName;
      },
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

}
