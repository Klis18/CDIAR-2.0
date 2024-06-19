import { Component, Input, OnInit } from '@angular/core';
import { LearnService } from '../../services/learn.service';
import { MatDialog } from '@angular/material/dialog';
import { CardConfirmComponent } from '../../../shared/pages/card-confirm/card-confirm.component';
import { EditFlashcardComponent } from '../edit-flashcard/edit-flashcard.component';

@Component({
  selector: 'questions-table',
  templateUrl: './questions-table.component.html',
  styles: ``
})
export class QuestionsTableComponent implements OnInit{
  
  @Input() idMazo: number = 0;

  data: any[] = [];

  mensaje: string = '';

  openDialog(message: string) {
    return this.dialog.open(CardConfirmComponent, {
      data: {
        mensaje: message,
      },
      width: '30%',
    });
  }
  constructor(private learnService: LearnService,  private dialog: MatDialog) { }
  
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
  

  eliminarFlashcard(idFlashcard: number) {
    const dialogRef = this.openDialog(
      '¿Estás seguro de eliminar esta flashcard?'
    );
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        console.log('Flashcard a eliminar', idFlashcard);
        console.log('Eliminando flashcard', res);
        this.learnService.deleteFlashcard(idFlashcard).subscribe(() => {
          console.log('Flashcard eliminada');
          this.listaPreguntas();
        });
      }
    });
  }

  editarFlashcard(idFlashcard: number) {
    this.dialog.open(EditFlashcardComponent, {
      width: '40%',
      data: {id: idFlashcard, isDisabled: true, titulo: 'Editar Flashcard'},
    });
  }

  viewFlashcard(idFlashcard: number) {
    this.dialog.open(EditFlashcardComponent, {
      width: '40%',
      data: {id: idFlashcard, isDisabled: false, titulo: 'Detalles Flashcard'},
    });
  }

}
