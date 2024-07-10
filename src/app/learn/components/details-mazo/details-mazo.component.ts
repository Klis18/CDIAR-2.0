import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LearnService } from '../../services/learn.service';
import { ListMazo, Mazo } from '../../interfaces/mazo.interface';
import { HomeService } from '../../../home/services/home.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-details-mazo',
  templateUrl: './details-mazo.component.html',
  styles: ``
})
export class DetailsMazoComponent implements OnInit{

  datosMazo!: Mazo;
  nivel: string = '';
  asignatura: string = '';
  usuarioCreador: string = '';    
  fechaCreacion: string = '';
  estado: string = '';
  nombreMazo: string = '';
  cantidadFlashcards: number = 0;
  nombreDocenteRevisor: string = '';
  preguntas: string[] = [];
  userRol: string = '';

  constructor(
    private learnService: LearnService,
    private homeService: HomeService,
    public dialogRef: MatDialogRef<DetailsMazoComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    // this.getDetailsMazo(this.data.id);
    // console.log(this.getDetailsMazo(this.data.id))
    this.nivel = this.data.nivel;
    this.asignatura = this.data.asignatura;
    this.learnService.getDatosMazo(this.data.id).subscribe((res: any) => {
      this.datosMazo = res.data;
      this.usuarioCreador = this.datosMazo.usuarioCreador;
      this.fechaCreacion = this.datosMazo.fechaCreacion;
      this.estado = this.datosMazo.estado;
      this.nombreMazo = this.datosMazo.nombreMazo;
      this.nombreDocenteRevisor = this.datosMazo.nombreRevisor;
      this.cantidadFlashcards = this.datosMazo.cantidadFlashcards;
      this.preguntas = this.datosMazo.preguntas;
      console.log(this.datosMazo)
    });

    this.homeService.obtenerDatosMenu().subscribe((user) => {
      this.userRol = user.data.rol;
    });
  }

  
  // getDetailsMazo(idMazo: number) {
  //   this.learnService.getDatosMazo(idMazo).subscribe((res: any) => {
  //     this.datosMazo = res.data;
  //     console.log(this.datosMazo)
  //   });
  // }
  redirigirEstudiarFlashcards() {
    this.learnService.guardarMazoEstudiado(this.data.id).subscribe((res) => {
      console.log('Mazo guardado', res.data);
      this.router.navigate(['/learn/estudiar-flashcards',{id: this.data.id, mazo: this.nombreMazo}]);
    });
    // this.router.navigate(['/learn/estudiar-flashcards',{id: item.idMazo, mazo: item.nombreMazo}]);
  }
  
  saveMazoToReview() {
    this.learnService.saveMazoToReview(this.data.id).subscribe(() => {
      console.log('Mazo guardado para futura revisión');
    });
  }

  cancelar() {
    this.dialogRef.close();
  }
  
}
