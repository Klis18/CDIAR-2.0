import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HomeService } from '../../../home/services/home.service';
import { AddResourceComponent } from '../../components/add-resource/add-resource.component';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styles: ``
})
export class ResourcesComponent implements OnInit{
  usuario: string = '';
  rol: string = '';
  selectedTab = 'Publicado';

  private homeService = inject(HomeService);

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    this.homeService.obtenerDatosMenu().subscribe((user) => {
      console.log(user);
      this.usuario = user.data.userName;
      this.rol = user.data.rol;
    });
  }

  searchInfo: any;
  emitSearch(res: any) {
    if (res) {
      this.searchInfo = res;
    }
  }
  
  openDialog() {
    this.dialog.open(AddResourceComponent, {
      width: '40%',
      maxHeight: '80%',
    });
  }
}
