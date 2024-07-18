import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { YouTubePlayer } from '@angular/youtube-player';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styles: ``
})
export class VideoPlayerComponent implements OnInit {
  // videoUrl!: string;
  // ngOnInit(): void {
  //   this.videoUrl = 'https://www.youtube.com/watch?v=AzTGmJGIpI8';
  //   this.updateVideoId();
  // }
  // embedUrl: string = '';
  // showQuestionForm: boolean = false;
  // videoUrl: string = '';
  // videoId: string = '';
  // currentTime: number = 0;
  // questions: { time: number, question: string, options: string[], correctAnswer: number }[] = [];
  // width = window.innerWidth;
  // height = window.innerHeight;

  // constructor(private route: ActivatedRoute, public sanitizer: DomSanitizer) {}

  // ngOnInit() {
  //   this.videoUrl = 'https://www.youtube.com/watch?v=AzTGmJGIpI8';
  //   this.updateVideoId();
  // }

  // @HostListener('window:resize', ['$event'])
  // onResize(event:any) {
  //   this.width = window.innerWidth ;
  //   console.log('Width',this.width);
  //   this.height = window.innerHeight;
  //   console.log('Height',this.height);
  // }

  // updateVideoId() {
  //   const videoIdMatch = this.videoUrl.match(
  //     /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  //   );

  //   if (videoIdMatch) {
  //     this.videoId = videoIdMatch[1];
  //   } else {
  //     // Manejar el caso en el que la URL no sea válida
  //     this.videoId = '';
  //   }
  // }

  // addQuestion() {
  //   this.currentTime = this.getCurrentTime();
  //   this.showQuestionForm = true;
  // }

  // handleAddQuestion(question: { question: string, options: string[], correctAnswer: number }) {
  //   this.questions.push({ ...question, time: this.currentTime });
  //   this.showQuestionForm = false;
  // }

  // getCurrentTime(): number {
  //   const player = <HTMLIFrameElement>document.getElementById('videoPlayer');
  //   // Aquí necesitarías una manera de obtener el tiempo actual del video, lo cual
  //   // puede necesitar la API de YouTube Player.
  //   return 0; // Simulación del tiempo actual
  // }

  //---------------------------------PRUEBA---------------------------------
  embedUrl!: SafeResourceUrl;
  showQuestionForm: boolean = false;
  videoUrl: string = '';
  videoId: string = '';
  currentTime: number = 0;
  questions: { time: number, question: string, options: string[], correctAnswer: number }[] = [];
  width: number = window.innerWidth;
  height: number = window.innerHeight;
  youtubeApiKey = environment.youtubeApiKey; // Accede a la clave de API desde el entorno

  @ViewChild('youtubePlayer') youtubePlayer!: YT.Player;

  constructor(private route: ActivatedRoute, public sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.videoUrl = 'https://www.youtube.com/watch?v=AzTGmJGIpI8';
    this.updateVideoId();
    this.embedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${this.videoId}?enablejsapi=1&origin=http://localhost:4200&autoplay=1&controls=1&fs=1&rel=0&modestbranding=1&color=white&showinfo=0&key=${this.youtubeApiKey}`);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }

  updateVideoId() {
    const videoIdMatch = this.videoUrl.match(
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );

    if (videoIdMatch) {
      this.videoId = videoIdMatch[1];
    } else {
      this.videoId = '';
    }
  }

  addQuestion() {
    this.currentTime = this.youtubePlayer.getCurrentTime();
    console.log('Current time', this.currentTime);
    this.showQuestionForm = true;
  }

  handleAddQuestion(question: { question: string, options: string[], correctAnswer: number }) {
    this.questions.push({ ...question, time: this.currentTime });
    this.showQuestionForm = false;
  }


  // videoId = 'tu_video_id'; // Id del video de YouTube
  // showQuestionForm = false;
  // currentTime = 0; // Variable para almacenar el tiempo actual del video

  // @ViewChild('youtubePlayer', { static: false }) youtubePlayer!: ElementRef;

  // // Método para manejar la adición de preguntas
  // addQuestion() {
  //   // Obtener el tiempo actual del video
  //   this.currentTime = this.youtubePlayer.nativeElement.getCurrentTime();
  //   console.log('Current time:', this.currentTime);
  //   this.showQuestionForm = true;
  //   // if (this.youtubePlayer && this.youtubePlayer.nativeElement) {
  //   // }
  // }

  //  updateVideoId() {
  //   const videoIdMatch = this.videoUrl.match(
  //     /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  //   );

  //   if (videoIdMatch) {
  //     this.videoId = videoIdMatch[1];
  //   } else {
  //     this.videoId = '';
  //   }
  // }

  // // Método para manejar la adición de pregunta desde el formulario
  // handleAddQuestion(event: any) {
  //   // Aquí podrías manejar la lógica para agregar la pregunta
  //   console.log('Pregunta agregada:', event);
  //   this.showQuestionForm = false;
  // }

}
