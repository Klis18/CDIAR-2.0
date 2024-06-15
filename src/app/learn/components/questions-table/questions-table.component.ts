import { Component, Input, OnInit } from '@angular/core';
import { LearnService } from '../../services/learn.service';

@Component({
  selector: 'questions-table',
  templateUrl: './questions-table.component.html',
  styles: ``
})
export class QuestionsTableComponent implements OnInit{
  
  @Input() idMazo: number = 0;

  data: any[] = [];

  constructor(private learnService: LearnService) { }
  
  ngOnInit(){

    this.listaPreguntas();
    
  }

  listaPreguntas() {
    const paginate = {
      // page: this.resourceTable.get('page')?.value,
      // limit: this.resourceTable.get('limit')?.value,
      id: this.idMazo,
      page: 1,
      limit: 10,
    };
    this.learnService.getFlashcardsMazo(paginate).subscribe((res: any) => {
      console.log(res);
      this.data = res.data;
    });
  }
  

  // eliminarRecurso(idRecurso: number) {
  //   const dialogRef = this.openDialog(
  //     '¿Estás seguro de eliminar este recurso?'
  //   );
  //   dialogRef.afterClosed().subscribe((res) => {
  //     if (res) {
  //       console.log('Eliminando recurso', res);
  //       this.recursoService.eliminarRecurso(idRecurso).subscribe(() => {
  //         console.log('Recurso eliminado');
  //         this.listaRecursos();
  //       });
  //     }
  //   });
  // }

  // editarRecurso(idRecurso: number, item:any) {
  //   if(this.canEdit(item)){
  //     if (item.usuarioCreacion == this.usuario) {
  //       this.tituloRecurso = 'Editar Recurso';
  //     } else if (item.docenteRevisor == this.usuario) {
  //       this.tituloRecurso = 'Aprobar Recurso';
  //     } else {
  //       this.tituloRecurso = 'Asignar Revisor';
  //     }
  //   }
  //   this.dialog.open(EditResourceComponent, {
  //     width: '40%',
  //     data: {id: idRecurso, titulo: this.tituloRecurso},
  //   });
  // }

}
