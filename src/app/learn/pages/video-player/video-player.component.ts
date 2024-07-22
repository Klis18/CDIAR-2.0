import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { YouTubePlayer } from '@angular/youtube-player';
import { environment } from '../../../../environments/environment';
import { QuestionService } from '../../services/question.service';
import { VideolearnService } from '../../services/videolearn.service';
import { HomeService } from '../../../home/services/home.service';
import { AddQuestionsVideolearnComponent } from '../../components/add-questions-videolearn/add-questions-videolearn.component';
import { MatDialog } from '@angular/material/dialog';
import { updateStatusVideolearn } from '../../interfaces/videolearn.interface';
import { ObservacionRechazoComponent } from '../../../shared/pages/observacion-rechazo/observacion-rechazo.component';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styles: ``
})
export class VideoPlayerComponent implements OnInit, OnDestroy {
  videoUrl: string = '';
  videoId: string = '';
  rol: string = '';
  questions: any[] = [];
  currentMinute: number = 0;
  newQuestion: string = '';
  options: string[] = ['', '', '', ''];
  correctOption: number = 0;
  player: any;
  nombreVideoLearn: string = '';
  idVideoLearn: number = 0;

  creadorVideolearn: string = '';
  estadoVideolearn: string = '';
  searchInfo: any;
  nombreUsuario: string = '';
  nombreRevisor: string = '';
  observacionRechazo: string = '';
  observationVisible: boolean = false;


  constructor(private route: ActivatedRoute,
              public dialog: MatDialog, 
              private videolearnService: VideolearnService,
              private homeService: HomeService,
              private questionService: QuestionService,
              private router: Router,
            ) {}

  ngOnInit() {

    this.route.params.subscribe(params => {
      this.nombreVideoLearn = params['videolearn'];
      this.idVideoLearn= params['id'];
    });


    this.homeService.obtenerDatosMenu().subscribe((user:any) => {
      this.rol = user.data.rol;
      this.nombreUsuario = user.data.userName;
    });

    this.videolearnService.getVideoLearn(this.idVideoLearn).subscribe((res) => {
      this,this.videoUrl = res.data.enlaceVideo;
      this.videoId = this.extractVideoId(this.videoUrl);
      this.estadoVideolearn = res.data.estado;
      this.creadorVideolearn = res.data.usuarioCreador;
      this.nombreRevisor = res.data.nombreRevisor;
      this.loadYouTubePlayer();
    });
    // this.route.queryParams.subscribe(params => {
    //   this.videoUrl = 'https://www.youtube.com/watch?v=7i_W9utnQHQ';
    //   this.videoId = this.extractVideoId(this.videoUrl);
    //   this.loadYouTubePlayer();
    // });
  }

  ngOnDestroy() {
    if (this.player) {
      this.player.destroy();
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
      // playerVars: {
      //   controls: 0 // Desactivar los controles
      // },
      events: {
        'onReady': this.onPlayerReady.bind(this),
        'onStateChange': this.onPlayerStateChange.bind(this)
      }
    });
  }

  onPlayerReady(event: any) {
    // Player is ready
  }

  onPlayerStateChange(event: any) {
    if (event.data == YT.PlayerState.PLAYING) {
      setInterval(() => {
        const currentTime = this.player.getCurrentTime();
        console.log('Current time:', currentTime);
        this.currentMinute = currentTime;
        this.checkVideoProgress();
      }, 1000);
    }
  }

  checkVideoProgress() {
    // Si el usuario intenta avanzar más allá del tiempo permitido, devolver el video al tiempo permitido
    if (this.player.getCurrentTime() > this.currentMinute) {
      this.player.seekTo(this.currentMinute, true);
    }
  }

  addQuestion() {
    // this.questionService.addQuestion({
    //   minute: this.currentMinute,
    //   question: this.newQuestion,
    //   options: this.options,
    //   correctOption: this.correctOption
    // });
    // this.newQuestion = '';
    // this.options = ['', '', '', ''];
    // this.correctOption = 0;
    this.player.pauseVideo();
    console.log('Datos a enviar', this.idVideoLearn, this.currentMinute);
    const dialogRef = this.dialog.open(AddQuestionsVideolearnComponent, {
      width: '40%',
      maxHeight: '80%',
      data: {id: this.idVideoLearn, minutos: this.currentMinute},
    });
    
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadTable();
        this.player.playVideo();
      }
    });
  }

  reloadTable: boolean = false;


  loadTable() {
    this.reloadTable = true;
  }

  loadedTale() {
    this.reloadTable = false;
  }


  
  canAprove() {
    return this.rol === 'Docente' && this.nombreRevisor.trim() === this.nombreUsuario.trim() && this.estadoVideolearn != 'Aprobado' && this.estadoVideolearn != 'Rechazado';

  }

  canPublish(){
    return this.creadorVideolearn === this.nombreUsuario && (this.estadoVideolearn !== 'Aprobado' && this.estadoVideolearn !== 'Ingresado');
  }

  canCreate(){
    const Estudiante = this.rol === 'Estudiante' && this.creadorVideolearn=== this.nombreUsuario && this.estadoVideolearn !== 'Aprobado';
    const Docente = this.rol === 'Docente' && this.creadorVideolearn=== this.nombreUsuario;
    return Estudiante || Docente;
  }

  
  updateStatusVideolearn(idStatus: number){
    const videolearn: updateStatusVideolearn = {
      idVideoLearn: this.idVideoLearn,
      idEstado: idStatus
    
    };
    this.videolearnService.changeStatusVideolearn(videolearn).subscribe((res) => {
      console.log(res);
      this.router.navigate(['/learn/videolearns']);

    });
  }

  
  reprobarVideoLearn() {
    this.dialog.open(ObservacionRechazoComponent, {
      width: '55%',
      maxHeight: '90%',
      data: {id: this.idVideoLearn, opcion:'videolearn'},
    });
  }

  viewObservation(){
    this.dialog.open(ObservacionRechazoComponent, {
      width: '55%',
      maxHeight: '90%',
      data: {id: this.idVideoLearn, opcion:'verObservacionVideolearn'},
    });
  }

  canViewObservation(){
    return this.rol ==='Estudiante' && this.observacionRechazo !== '';
  }

  publishVideoLearn(){
    if(this.rol === 'Docente'){
      this.updateStatusVideolearn(2);
  }
  else{
    this.updateStatusVideolearn(1);
  }
  }
  

}
