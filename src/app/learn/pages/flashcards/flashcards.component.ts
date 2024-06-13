import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddResourceComponent } from '../../../academic-resources/components/add-resource/add-resource.component';
import { HomeService } from '../../../home/services/home.service';

@Component({
  selector: 'app-flashcards',
  templateUrl: './flashcards.component.html',
  styles: ``
})
export class FlashcardsComponent implements OnInit{
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

  openDialog() {
    this.dialog.open(AddResourceComponent, {
      width: '40%',
      maxHeight: '80%',
    });
  }
}
