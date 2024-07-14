import { Component, Inject, OnInit } from '@angular/core';
import { getVideolearn } from '../../interfaces/videolearn.interface';
import { VideolearnService } from '../../services/videolearn.service';
import { HomeService } from '../../../home/services/home.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-videolearn-details',
  templateUrl: './videolearn-details.component.html',
  styles: ``
})
export class VideolearnDetailsComponent implements OnInit{
  datosVideoLearn!: getVideolearn;
  nivel: string = '';
  asignatura: string = '';
  usuarioCreador: string = '';    
  fechaCreacion: string = '';
  estado: string = '';
  nombreVideolearn: string = '';
  cantidadPreguntas: number = 0;
  nombreDocenteRevisor: string = '';
  preguntas: string[] = [];
  userRol: string = '';

  constructor(
    private videolearnService: VideolearnService,
    private homeService: HomeService,
    public dialogRef: MatDialogRef<VideolearnDetailsComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    // this.getDetailsMazo(this.data.id);
    // console.log(this.getDetailsMazo(this.data.id))
    // this.nivel = this.data.nivel;
    // this.asignatura = this.data.asignatura;
    this.videolearnService.getVideoLearn(this.data.id).subscribe((res: any) => {
      this.datosVideoLearn = res.data;
      this.asignatura = this.datosVideoLearn.asignatura;
      this.nivel = this.datosVideoLearn.nivel;
      this.usuarioCreador = this.datosVideoLearn.usuarioCreador;
      this.fechaCreacion = this.datosVideoLearn.fechaCreacion;
      this.estado = this.datosVideoLearn.estado;
      this.nombreVideolearn = this.datosVideoLearn.nombreVideoLearn;
      this.nombreDocenteRevisor = this.datosVideoLearn.nombreRevisor;
      this.cantidadPreguntas = this.datosVideoLearn.cantidadPreguntas;
      //this.preguntas = this.datosVideoLearn.preguntas;
      console.log(this.datosVideoLearn)
    });

    this.homeService.obtenerDatosMenu().subscribe((user) => {
      this.userRol = user.data.rol;
    });
  }

  //TODO:
  redirigirEstudiarFlashcards() {
    // this.learnService.guardarMazoEstudiado(this.data.id).subscribe((res) => {
    //   console.log('Mazo guardado', res.data);
    //   this.router.navigate(['/learn/estudiar-flashcards',{id: this.data.id, mazo: this.nombreMazo}]);
    // });
  }
  
  //TODO:
  saveMazoToReview() {
    // this.learnService.saveMazoToReview(this.data.id).subscribe(() => {
    //   console.log('Mazo guardado para futura revisión');
    // });
  }

  cancelar() {
    this.dialogRef.close();
  }
}
