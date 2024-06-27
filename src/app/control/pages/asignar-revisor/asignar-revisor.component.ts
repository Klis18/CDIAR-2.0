import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditResourceComponent } from '../../../academic-resources/components/edit-resource/edit-resource.component';
import { EstadosRecursos, ListaRecurso } from '../../../academic-resources/interfaces/recurso.interface';
import { ResourcesComponent } from '../../../academic-resources/pages/resources/resources.component';
import { RecursoService } from '../../../academic-resources/services/recurso.service';
import { HomeService } from '../../../home/services/home.service';

@Component({
  selector: 'app-asignar-revisor',
  templateUrl: './asignar-revisor.component.html',
  styles: ``
})
export class AsignarRevisorComponent {
 
  @Input() filterByStatus: string = '';

  usuario: string = '';
  searchInfo: any;
  roleName: string = '';

  constructor(
    private homeService: HomeService
  ) {}

  ngOnInit(): void {

    this.homeService.obtenerDatosMenu().subscribe((user) => {
      console.log(user);
      this.usuario = user.data.userName;
      this.roleName = user.data.rol;
    });
  }

  
  selectedTab = 'Recursos Académicos';
 

  emitSearch(res: any) {
    if (res) {
      this.searchInfo = res;
    }
  }
  reloadTable: boolean = false;

  loadedTale() {
    this.reloadTable = false;
  }
}
