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
  id = this.data.id;
  opcion = this.data.opcion;

  constructor(private securityService: SecurityService,
              @Inject (MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<ListRevisorComponent>
  ){
    
  }

  ngOnInit(){
    // this.getListaDocentes(); 
    this.getDocentesRevision();
  }

  // getListaDocentes(){
  //   this.securityService.getListaDocentes().subscribe((res) => {
  //     this.dataDocentes = res.data;
  //     console.log(res);
  //   });
  // }

  getDocentesRevision(){
    this.securityService.getDocentesRevision().subscribe((res) => {
      this.dataDocentes = res.data;
      console.log(res);
    });
  
  }

  asignarRevisor(idDocente: string){
    if(this.opcion === 'Mazo'){
      const revisor = {
        idMazo: this.id,
        idDocenteRevisor: idDocente
      }
      this.securityService.asignarRevisorMazo(revisor).subscribe((res) => {
        this.CloseModal('Revisor asignado exitosamente');      
      });
    }else if(this.opcion === 'Recursos'){
      const revisor = {
        idRecurso: this.id,
        idDocenteRevisor: idDocente
      }
      
    }
    
    
  }

  cancelar() {
    this.dialogRef.close();
  }

  
  CloseModal(mensaje?: string) {
    this.dialogRef.close(mensaje);
  }

}
