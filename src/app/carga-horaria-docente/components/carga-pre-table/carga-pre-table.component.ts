import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { CargaHorariaDocenteService } from '../../services/carga-horaria-docente.service';

@Component({
  selector: 'carga-pre-table',
  templateUrl: './carga-pre-table.component.html',
  styles: `
     td.acciones{
      width: 10px;
    }
    td{
      max-width: 70px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `
})
export class CargaPreTableComponent {
  
  // @Input() idMazo: number = 0;
  @Input() cargaHorariaDoc: any[] = [];
  @Output() cargaAdd = new EventEmitter<string[]>();

  data: any[] = [];

  constructor(private cargaHorariaService: CargaHorariaDocenteService) { }

  ngOnInit(){
    this.cargaHorariaDoc;
    
  }

  ngOnChanges(changes: SimpleChanges){
    if(changes['cargaHorariaDoc']){
      this.cargaAdd.emit(this.cargaHorariaDoc);    
    }
  }

  eliminarItem(index:number){
    this.cargaHorariaDoc.splice(index, 1);
  }


}
