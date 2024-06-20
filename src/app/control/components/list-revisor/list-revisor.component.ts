import { Component, Inject, OnInit } from '@angular/core';
import { SecurityService } from '../../services/security.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-list-revisor',
  templateUrl: './list-revisor.component.html',
  styles: ``
})
export class ListRevisorComponent implements OnInit{

  dataDocentes: any;
  idMazo = this.data.idMazo;

  constructor(private securityService: SecurityService,
              @Inject (MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<ListRevisorComponent>
  ){
    
  }

  ngOnInit(){

    this.getListaDocentes();
    
  }

  getListaDocentes(){
    this.securityService.getListaDocentes().subscribe((res) => {
      this.dataDocentes = res.data;
      console.log(res);
    });
  }

  asignarRevisor(idDocente: string){
    const revisor = {
      idMazo: this.idMazo,
      idDocenteRevisor: idDocente
    }
    this.securityService.asignarRevisor(revisor).subscribe((res) => {
      console.log('Revisor asignado',res);
    });
  }

  cancelar() {
    this.dialogRef.close();
  }


}
