import { Component, OnDestroy, OnInit } from '@angular/core';
import { obtenerPreguntasRespuestas } from '../../interfaces/videolearn.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { VideolearnService } from '../../services/videolearn.service';
import { HomeService } from '../../../home/services/home.service';
import { VideolearnShowQuestionComponent } from '../../components/videolearn-show-question/videolearn-show-question.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-start-videolearn',
  templateUrl: './start-videolearn.component.html',
  styles: ``
})
export class StartVideolearnComponent implements OnInit, OnDestroy {
  
  // idVideolearn!: number;
  // preguntasVideolearn!: obtenerPreguntasRespuestas[];
  // preguntaActualIndex = 0;
  // respuestaSeleccionada: number | null = null;
  // respuestasUsuario: boolean[][] = [];
  // nombreVideolearn!: string;
  // puntaje = 0;
  // btnName!:string;
  // esCorrecta!: boolean ;
  // isVisible:boolean = false;

  // constructor(private route: ActivatedRoute,private videolearnService: VideolearnService, private router: Router) { }

  // ngOnInit(): void {
  //   this.route.params.subscribe(params => {
  //     this.nombreVideolearn = params['videolearn'];
  //     this.idVideolearn = params['id'];
  //   });

  //   this.getPreguntasVideolearn(this.idVideolearn);
  //   console.log(this.preguntasVideolearn);
  // }

  // getPreguntasVideolearn(idVideolearn: number){
  //   this.videolearnService.startVideolearn(idVideolearn).subscribe((res) => {
  //     this.preguntasVideolearn = res.data;
  //     console.log('DATA VIDEOLEARN',res.data);
  //     this.inicializarRespuestasUsuario();
  //   });
  // }

  // inicializarRespuestasUsuario(): void {
  //   this.respuestasUsuario = new Array(this.preguntasVideolearn.length).fill([])
  //     .map(() => new Array<boolean>(this.preguntasVideolearn[this.preguntaActualIndex].opcionesRespuestas.length).fill(false));
  // }

  // toggleRespuesta(index: number) {
  //   this.respuestasUsuario[this.preguntaActualIndex][index] = !this.respuestasUsuario[this.preguntaActualIndex][index];
  // }
  // verificarRespuesta(): void {
  //   const opcionesRespuestas = this.preguntasVideolearn[this.preguntaActualIndex].opcionesRespuestas;

  //   // Obtener índices de respuestas correctas
  //   const respuestasCorrectasIndices = opcionesRespuestas
  //     .map((opcion, index) => opcion.esCorrecta ? index : -1)
  //     .filter(index => index !== -1);
  
  //   if (this.preguntasVideolearn[this.preguntaActualIndex].tipoPregunta === 'Opcion Simple') {
  //     // Para preguntas de opción simple, solo una respuesta puede ser correcta
  //     if (respuestasCorrectasIndices.includes(this.respuestaSeleccionada!)) {
  //       this.puntaje++;
  //     }
  //   } else {

  //   }
  // }

  // siguientePregunta(){
  //   this.verificarRespuesta();
  //   this.preguntaActualIndex++;
  //   if (this.preguntaActualIndex < this.preguntasVideolearn.length) {
  //     this.inicializarRespuestasUsuario();
  //   }
  //   else if (this.preguntaActualIndex === this.preguntasVideolearn.length) {
  //     this.guardarCalificacion();
  //   }
  // }


  // reiniciar(){
  //   this.preguntaActualIndex = 0;
  //   this.puntaje = 0;
  //   this.inicializarRespuestasUsuario();
  //   this.router.navigate(['/learn/iniciar-videolearn',{id: this.idVideolearn, videolearn: this.nombreVideolearn}]);
  
  // }

  // guardarCalificacion(){
  //   const calificacion = {
  //     idVideoLearn: this.idVideolearn,
  //     calificacion: this.puntaje,
  //   };
  //   this.videolearnService.saveResultTest(calificacion).subscribe(() => {
  //     console.log('Calificación guardada');
  //   });
  // }


  //------------------------------------------------------FUNCIONA PERO HAY COSAS QUE ARREGLAR-------------------------
  videoUrl: string = '';
  videoId: string = '';
  // questions: any[] = [];
  currentMinute: number = 0;
  player: any;
  interval: any;
  // modalReference: any;
  preguntasVideolearn!: obtenerPreguntasRespuestas[];
  nombreVideoLearn!: string;
  idVideoLearn!: number;
  rol: string = '';
  calificacion: number = 0;
  videoDuration: number = 0;
  videoDurationEnd: number = 0;
  cantidadPreguntas: number = 0;
  tiempoRestante: number = 0;

  constructor(
    private route: ActivatedRoute, 
    private videolearnService: VideolearnService,
    private homeService: HomeService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.nombreVideoLearn = params['videolearn'];
      this.idVideoLearn= params['id'];
    });


    this.homeService.obtenerDatosMenu().subscribe((user:any) => {
      this.rol = user.data.rol;
    });

    this.videolearnService.getVideoLearn(this.idVideoLearn).subscribe((res) => {
      this,this.videoUrl = res.data.enlaceVideo;
      this.videoId = this.extractVideoId(this.videoUrl);
      this.loadYouTubePlayer();
    });

    this.getPreguntasVideolearn(this.idVideoLearn);
  }

  ngOnDestroy() {
    if (this.player) {
      this.player.destroy();
    }
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  extractVideoId(url: string): string {
    const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/);
    return videoIdMatch ? videoIdMatch[1] : '';
  }

  loadYouTubePlayer() {
    if (window['YT']) {
      this.initPlayer();
    } else {
      (window as any)['onYouTubeIframeAPIReady'] = () => this.initPlayer();
    }
  }

  initPlayer() {
    this.player = new YT.Player('youtube-player', {
      videoId: this.videoId,
      playerVars: {
        controls: 0 // Desactivar los controles
      },
      events: {
        'onReady': this.onPlayerReady.bind(this),
        'onStateChange': this.onPlayerStateChange.bind(this),
      }
    });
  }

  onPlayerReady(event: any) {
    // Player is ready
    this.videoDuration = this.player.getDuration(event.target);
    this.videoDurationEnd = this.videoDuration - 2;

  }

  onPlayerStateChange(event: any) {
    if (event.data == YT.PlayerState.PLAYING) {
      this.interval = setInterval(() => {
        const currentTime = this.player.getCurrentTime();
        this.currentMinute = currentTime;
        this.tiempoRestante = this.videoDurationEnd - this.currentMinute;
        this.checkForQuestion();
        if (Math.floor(this.currentMinute) === this.videoDurationEnd) {
          this.player.pauseVideo();
          this.guardarCalificacion();
        }
      }, 1000);
    } else {
      clearInterval(this.interval);
    }
  }

  checkForQuestion() {
    const question = this.preguntasVideolearn.find(q => Math.floor(q.minutoVideo) === Math.floor(this.currentMinute));
    if (question) {
      this.player.pauseVideo();
      this.openQuestionModal(question);
    }
  }

   getPreguntasVideolearn(idVideolearn: number){
    this.videolearnService.startVideolearn(idVideolearn).subscribe((res) => {
      this.preguntasVideolearn = res.data;
      this.cantidadPreguntas = this.preguntasVideolearn.length;

    });
  }


  openQuestionModal(question: any) {
    const dialogRef = this.dialog.open(VideolearnShowQuestionComponent, {
      width: '40%',
      maxHeight: '80%',
      data: {
        question: question,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.result === 'answered') {
        if (result.puntaje === 1) {
          this.calificacion += 1;
        }
        this.player.playVideo();
      }
    });
    console.log( 'Calificacion',this.calificacion);
  }

   reiniciar(){
    this.router.navigate(['/learn/preguntas-video',{id: this.idVideoLearn, videolearn: this.nombreVideoLearn}]);
  
  }

   guardarCalificacion(){
    const calificacion = {
      idVideoLearn: this.idVideoLearn,
      calificacion: this.calificacion,
    };
    this.videolearnService.saveResultTest(calificacion).subscribe(() => {
      console.log('Calificación guardada');
    });
  }

  canDoVideoLearn(){
    const caso1 = this.currentMinute === 0;
    const caso2 = this.currentMinute < this.videoDurationEnd;
    return caso1 || caso2;
  }
  





//  videoUrl: string = '';
// videoId: string = '';
// questions: any[] = [];
// currentMinute: number = 0;
// player: any;
// interval: any;
// modalReference: any;
// preguntasVideolearn!: obtenerPreguntasRespuestas[];
// nombreVideoLearn!: string;
// idVideoLearn!: number;
// rol: string = '';
// calificacion: number = 0;
// videoDuration: number = 0;
// videoDurationEnd: number = 0;
// finalCheckDone: boolean = false; // Para evitar múltiples guardados

// constructor(
//   private route: ActivatedRoute, 
//   private videolearnService: VideolearnService,
//   private homeService: HomeService,
//   private dialog: MatDialog,
//   private router: Router
// ) {}

// ngOnInit() {
//   this.route.params.subscribe(params => {
//     this.nombreVideoLearn = params['videolearn'];
//     this.idVideoLearn = params['id'];
//   });

//   this.homeService.obtenerDatosMenu().subscribe((user: any) => {
//     this.rol = user.data.rol;
//   });

//   this.videolearnService.getVideoLearn(this.idVideoLearn).subscribe((res) => {
//     this.videoUrl = res.data.enlaceVideo;
//     this.videoId = this.extractVideoId(this.videoUrl);
//     this.loadYouTubePlayer();
//   });

//   this.getPreguntasVideolearn(this.idVideoLearn);
// }

// ngOnDestroy() {
//   if (this.player) {
//     this.player.destroy();
//   }
//   if (this.interval) {
//     clearInterval(this.interval);
//   }
// }

// extractVideoId(url: string): string {
//   const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/);
//   return videoIdMatch ? videoIdMatch[1] : '';
// }

// loadYouTubePlayer() {
//   if (window['YT']) {
//     this.initPlayer();
//   } else {
//     (window as any)['onYouTubeIframeAPIReady'] = () => this.initPlayer();
//   }
// }

// initPlayer() {
//   this.player = new YT.Player('youtube-player', {
//     videoId: this.videoId,
//     playerVars: {
//       controls: 0 // Desactivar los controles
//     },
//     events: {
//       'onReady': this.onPlayerReady.bind(this),
//       'onStateChange': this.onPlayerStateChange.bind(this),
//     }
//   });
// }

// onPlayerReady(event: any) {
//   // Player is ready
//   this.videoDuration = this.player.getDuration(event.target);
//   console.log('Duration:', this.videoDuration);
//   this.videoDurationEnd = this.videoDuration - 10;
// }

// onPlayerStateChange(event: any) {
//   if (event.data == YT.PlayerState.PLAYING) {
//     this.interval = setInterval(() => {
//       const currentTime = this.player.getCurrentTime();
//       this.currentMinute = currentTime;
//       this.checkForQuestion();
//       this.checkForFinalSave();
//     }, 1000);
//   } else {
//     clearInterval(this.interval);
//   }
// }

// checkForQuestion() {
//   console.log('Current minute:', this.currentMinute);
//   const question = this.preguntasVideolearn.find(q => Math.floor(q.minutoVideo) === Math.floor(this.currentMinute));
//   console.log('Pregunta:', question);
//   if (question) {
//     this.player.pauseVideo();
//     this.openQuestionModal(question);
//   }
// }

// checkForFinalSave() {
//   const remainingTime = this.videoDuration - Math.floor(this.currentMinute);
//   console.log('Remaining time:', remainingTime);
//   if (remainingTime <= 10 && !this.finalCheckDone) { // 1 minuto antes del final
//     this.guardarCalificacion();
//     this.finalCheckDone = true; // Evitar múltiples guardados
//   }
// }

// getPreguntasVideolearn(idVideolearn: number) {
//   this.videolearnService.startVideolearn(idVideolearn).subscribe((res) => {
//     this.preguntasVideolearn = res.data;
//   });
// }

// openQuestionModal(question: any) {
//   const dialogRef = this.dialog.open(VideolearnShowQuestionComponent, {
//     width: '40%',
//     maxHeight: '80%',
//     data: {
//       question: question,
//     },
//   });
//   dialogRef.afterClosed().subscribe((result) => {
//     if (result && result.result === 'answered') {
//       if (result.puntaje === 1) {
//         this.calificacion += 1;
//       }
//       this.player.playVideo();
//     }
//   });
//   console.log('Calificacion', this.calificacion);
// }

// reiniciar() {
//   this.player.seekTo(0); // Reiniciar el video al principio
//   this.currentMinute = 0;
//   this.calificacion = 0;
//   this.finalCheckDone = false;
//   this.router.navigate(['/learn/preguntas-video', { id: this.idVideoLearn, videolearn: this.nombreVideoLearn }]);
// }

// guardarCalificacion() {
//   const calificacion = {
//     idVideoLearn: this.idVideoLearn,
//     calificacion: this.calificacion,
//   };
//   this.videolearnService.saveResultTest(calificacion).subscribe(() => {
//     console.log('Calificación guardada');
//   }, (error) => {
//     console.error('Error al guardar la calificación', error);
//   });
// }

// canDoVideoLearn() {
//   const caso1 = this.currentMinute === 0;
//   const caso2 = this.currentMinute < this.videoDurationEnd;
//   return caso1 || caso2;
// }
}
