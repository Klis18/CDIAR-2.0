import { Component, OnInit } from '@angular/core';
import { SimulatorsQuestions, TipoPreguntas } from '../../interfaces/simulators.interface';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { SimulatorsService } from '../../services/simulators.service';

@Component({
  selector: 'app-start-simulator',
  templateUrl: './start-simulator.component.html',
  styles: `
    .flashcard-view{
      background-image: url('/assets/images/bgflashcard.jpg');
      background-size: cover;
    }
  `
})
export class StartSimulatorComponent implements OnInit {

  idSimulador!: number;
  preguntasSimulador!: SimulatorsQuestions[];
  preguntaActualIndex = 0;
  respuestaSeleccionada: number | null = null;
  respuestasUsuario: boolean[][] = [];
  nombreSimulador!: string;
  puntaje = 0;

  constructor(private route: ActivatedRoute,private simulatorsService: SimulatorsService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.nombreSimulador = params['simulador'];
      this.idSimulador = params['id'];
    });

    this.getPreguntasSimulador(this.idSimulador);
    console.log(this.preguntasSimulador);
  }

  getPreguntasSimulador(idSimulador: number){
    this.simulatorsService.startSimulator(idSimulador).subscribe((res) => {
      this.preguntasSimulador = res.data;
      console.log('DATA SIMULADORES',res.data);
      this.inicializarRespuestasUsuario();
    });
  }

  inicializarRespuestasUsuario(): void {
    this.respuestasUsuario = new Array(this.preguntasSimulador.length).fill([])
      .map(() => new Array<boolean>(this.preguntasSimulador[this.preguntaActualIndex].opcionesRespuestas.length).fill(false));
  }

  verificarRespuesta(): void {
    const opcionesRespuestas = this.preguntasSimulador[this.preguntaActualIndex].opcionesRespuestas;

    // Obtener índices de respuestas correctas
    const respuestasCorrectasIndices = opcionesRespuestas
      .map((opcion, index) => opcion.esCorrecta ? index : -1)
      .filter(index => index !== -1);
  
    if (this.preguntasSimulador[this.preguntaActualIndex].tipoPregunta === 'Opcion Simple') {
      // Para preguntas de opción simple, solo una respuesta puede ser correcta
      if (respuestasCorrectasIndices.includes(this.respuestaSeleccionada!)) {
        this.puntaje++;
      }
    } else {
      // Obtener índices de respuestas seleccionadas
      const respuestasSeleccionadasIndices = this.respuestasUsuario[this.preguntaActualIndex]
        .map((seleccionada, index) => seleccionada ? index : -1)
        .filter(index => index !== -1);
  
      // Verificar si todas las respuestas seleccionadas son correctas
      const todasCorrectas = respuestasCorrectasIndices.every(index =>
        respuestasSeleccionadasIndices.includes(index)
      );
  
      // Sumar puntaje si todas las respuestas seleccionadas son correctas
      if (todasCorrectas && respuestasSeleccionadasIndices.length === respuestasCorrectasIndices.length) {
        this.puntaje++;
      }
    }
  }

  siguientePregunta(){
    this.verificarRespuesta();
    this.preguntaActualIndex++;
    if (this.preguntaActualIndex < this.preguntasSimulador.length) {
      this.inicializarRespuestasUsuario();
    }
  }

  reiniciar(){
    this.preguntaActualIndex = 0;
    this.puntaje = 0;
    this.inicializarRespuestasUsuario();
  }

}
