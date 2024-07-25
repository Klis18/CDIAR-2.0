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
  
  videoUrl: string = '';
  videoId: string = '';
  currentMinute: number = 0;
  player: any;
  interval: any;
  preguntasVideolearn!: obtenerPreguntasRespuestas[];
  nombreVideoLearn!: string;
  idVideoLearn!: number;
  rol: string = '';
  calificacion: number = 0;
  videoDuration: number = 0;
  videoDurationEnd: number = 0;
  cantidadPreguntas: number = 0;
  tiempoRestante: number = 0;
  testIniciado: boolean = true;

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
        controls: 0 
      },
      events: {
        'onReady': this.onPlayerReady.bind(this),
        'onStateChange': this.onPlayerStateChange.bind(this),
      }
    });
  }

  onPlayerReady(event: any) {
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
      this.cantidadPreguntas = this.preguntasVideolearn?.length;

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
  
}