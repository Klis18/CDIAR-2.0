import { Component, OnInit } from '@angular/core';
import { obtenerPreguntasRespuestas } from '../../interfaces/videolearn.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { VideolearnService } from '../../services/videolearn.service';

@Component({
  selector: 'app-start-videolearn',
  templateUrl: './start-videolearn.component.html',
  styles: ``
})
export class StartVideolearnComponent implements OnInit {
  
  idVideolearn!: number;
  preguntasVideolearn!: obtenerPreguntasRespuestas[];
  preguntaActualIndex = 0;
  respuestaSeleccionada: number | null = null;
  respuestasUsuario: boolean[][] = [];
  nombreVideolearn!: string;
  puntaje = 0;
  btnName!:string;
  esCorrecta!: boolean ;
  isVisible:boolean = false;

  constructor(private route: ActivatedRoute,private videolearnService: VideolearnService, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.nombreVideolearn = params['videolearn'];
      this.idVideolearn = params['id'];
    });

    this.getPreguntasVideolearn(this.idVideolearn);
    console.log(this.preguntasVideolearn);
  }

  getPreguntasVideolearn(idVideolearn: number){
    this.videolearnService.startVideolearn(idVideolearn).subscribe((res) => {
      this.preguntasVideolearn = res.data;
      console.log('DATA VIDEOLEARN',res.data);
      this.inicializarRespuestasUsuario();
    });
    // this.simulatorsService.startSimulator(idSimulador).subscribe((res) => {
    //   this.preguntasSimulador = res.data;
    //   console.log('DATA SIMULADORES',res.data);
    //   this.inicializarRespuestasUsuario();
    // });
  }

  inicializarRespuestasUsuario(): void {
    this.respuestasUsuario = new Array(this.preguntasVideolearn.length).fill([])
      .map(() => new Array<boolean>(this.preguntasVideolearn[this.preguntaActualIndex].opcionesRespuestas.length).fill(false));
  }

  toggleRespuesta(index: number) {
    this.respuestasUsuario[this.preguntaActualIndex][index] = !this.respuestasUsuario[this.preguntaActualIndex][index];
  }
  verificarRespuesta(): void {
    const opcionesRespuestas = this.preguntasVideolearn[this.preguntaActualIndex].opcionesRespuestas;

    // Obtener índices de respuestas correctas
    const respuestasCorrectasIndices = opcionesRespuestas
      .map((opcion, index) => opcion.esCorrecta ? index : -1)
      .filter(index => index !== -1);
  
    if (this.preguntasVideolearn[this.preguntaActualIndex].tipoPregunta === 'Opcion Simple') {
      // Para preguntas de opción simple, solo una respuesta puede ser correcta
      if (respuestasCorrectasIndices.includes(this.respuestaSeleccionada!)) {
        this.puntaje++;
      }
    } else {

      // Obtener índices de respuestas seleccionadas

      // const respuestasSeleccionadasIndices = this.respuestasUsuario[this.preguntaActualIndex]
      //   .map((seleccionada, index) => seleccionada ? index : -1)
      //   .filter(index => index !== -1);
  
      // Verificar si todas las respuestas seleccionadas son correctas
      // const todasCorrectas = respuestasCorrectasIndices.every(index =>
      //   respuestasSeleccionadasIndices.includes(index)
      // );
  
      // Sumar puntaje si todas las respuestas seleccionadas son correctas
      // if (todasCorrectas && respuestasSeleccionadasIndices.length === respuestasCorrectasIndices.length) {
      //   this.puntaje++;
      // }
    }
  }

  siguientePregunta(){
    this.verificarRespuesta();
    this.preguntaActualIndex++;
    if (this.preguntaActualIndex < this.preguntasVideolearn.length) {
      this.inicializarRespuestasUsuario();
    }
    else if (this.preguntaActualIndex === this.preguntasVideolearn.length) {
      this.guardarCalificacion();
    }
  }


  reiniciar(){
    this.preguntaActualIndex = 0;
    this.puntaje = 0;
    this.inicializarRespuestasUsuario();
    this.router.navigate(['/learn/iniciar-videolearn',{id: this.idVideolearn, videolearn: this.nombreVideolearn}]);
  
  }

  guardarCalificacion(){
    const calificacion = {
      idVideoLearn: this.idVideolearn,
      calificacion: this.puntaje,
    };
    this.videolearnService.saveResultTest(calificacion).subscribe(() => {
      console.log('Calificación guardada');
    });
    
  }

}
