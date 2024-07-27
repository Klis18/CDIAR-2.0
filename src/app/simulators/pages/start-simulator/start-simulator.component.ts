import { Component, OnInit } from '@angular/core';
import { SimulatorsQuestions} from '../../interfaces/simulators.interface';
import { ActivatedRoute } from '@angular/router';
import { SimulatorsService } from '../../services/simulators.service';
import { MatDialog } from '@angular/material/dialog';
import { VerifyAnswerComponent } from '../../../shared/pages/verify-answer/verify-answer.component';

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
  btnName!:string;
  cantPreguntasSimulador!: number;

  constructor(private route: ActivatedRoute,
              private simulatorsService: SimulatorsService,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.nombreSimulador = params['simulador'];
      this.idSimulador = params['id'];
    });

    this.getPreguntasSimulador(this.idSimulador);
  }

  getPreguntasSimulador(idSimulador: number){
    this.simulatorsService.startSimulator(idSimulador).subscribe((res) => {
      this.preguntasSimulador = res.data;
      this.cantPreguntasSimulador = this.preguntasSimulador?.length;
      this.inicializarRespuestasUsuario();
    });
  }

  inicializarRespuestasUsuario(): void {
    this.respuestasUsuario = new Array(this.preguntasSimulador.length).fill([])
      .map(() => new Array<boolean>(this.preguntasSimulador[this.preguntaActualIndex].opcionesRespuestas.length).fill(false));
  }

  toggleRespuesta(index: number) {
    this.respuestasUsuario[this.preguntaActualIndex][index] = !this.respuestasUsuario[this.preguntaActualIndex][index];
  }
  verificarRespuesta(): void {
    const opcionesRespuestas = this.preguntasSimulador[this.preguntaActualIndex].opcionesRespuestas;

    const respuestasCorrectasIndices = opcionesRespuestas
      .map((opcion, index) => opcion.esCorrecta ? index : -1)
      .filter(index => index !== -1);
  
    if (this.preguntasSimulador[this.preguntaActualIndex].tipoPregunta === 'Opción Simple') {
      if (respuestasCorrectasIndices.includes(this.respuestaSeleccionada!)) {
          this.respuestaCorrecta();
        this.puntaje++;
      }else{
        this.respuestaIncorrecta();
      }
    } else {

      const respuestasSeleccionadasIndices = this.respuestasUsuario[this.preguntaActualIndex]
        .map((seleccionada, index) => seleccionada ? index : -1)
        .filter(index => index !== -1);
  
      const todasCorrectas = respuestasCorrectasIndices.every(index =>
        respuestasSeleccionadasIndices.includes(index)
      );
  
      if (todasCorrectas && respuestasSeleccionadasIndices.length === respuestasCorrectasIndices.length) {
        this.respuestaCorrecta();
        this.puntaje++;
      }else{
        this.respuestaIncorrecta();
      }
    }
  }

  siguientePregunta(){
    this.verificarRespuesta();
    this.preguntaActualIndex++;
    if (this.preguntaActualIndex < this.preguntasSimulador.length) {
      this.inicializarRespuestasUsuario();
    }
    else if (this.preguntaActualIndex === this.preguntasSimulador.length) {
      this.guardarCalificacion();
    }
  }

  reiniciar(){
    this.preguntaActualIndex = 0;
    this.puntaje = 0;
    this.inicializarRespuestasUsuario();
  }

  guardarCalificacion(){
    const calificacion = {
      idSimulador: this.idSimulador,
      calificacion: this.puntaje,
    };
    this.simulatorsService.saveResultTest(calificacion).subscribe(() => {
    });
  }


  respuestaCorrecta(){
    const dialogRef = this.dialog.open(VerifyAnswerComponent, {
      data: { imagen: 'correcta', mensaje: 'Respuesta Correcta' }
    });

    setTimeout(() => {
      dialogRef.close();
    }, 2000);
  }

  respuestaIncorrecta(){
    const dialogRef = this.dialog.open(VerifyAnswerComponent, {
      data: { imagen: 'incorrecta', mensaje: 'Respuesta Incorrecta' }
    });

    setTimeout(() => {
      dialogRef.close();
    }, 2000);
  }
}
