import { Component, HostListener } from '@angular/core';
import { VideolearnService } from '../../services/videolearn.service';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-show-video',
  templateUrl: './show-video.component.html',
  styles: `
     .flashcard-view{
      background-image: url('/assets/images/bgflashcard.jpg');
      background-size: cover;
    }
  `
})
export class ShowVideoComponent {
  nombreVideoLearn!: string;
  idVideoLearn!: number;
  urlVideoYtb!: string;
  videoId: string = '';

  width = window.innerWidth;
  height = window.innerHeight;

  constructor(private route: ActivatedRoute,
              private videolearnService: VideolearnService,
              private router:Router
            ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.nombreVideoLearn = params['videolearn'];
      this.idVideoLearn = params['id'];
      console.log('ID VideoLearn',this.idVideoLearn);
    });
    this.obtenerDatosVideoLearn(this.idVideoLearn);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event:any) {
    this.width = window.innerWidth ;
    console.log('Width',this.width);
    this.height = window.innerHeight;
    console.log('Height',this.height);
  }
  
  obtenerDatosVideoLearn(idVideo:number){
    this.videolearnService.getVideoLearn(idVideo).subscribe((res: any) => {
      this.urlVideoYtb = res.data.enlaceVideo;
      console.log('Carga inicial video ytb',this.urlVideoYtb);
      this.updateVideoId();
    });

    
  }

  updateVideoId() {
    console.log('Carga video update video ytb',this.urlVideoYtb);
    // Extraer el ID del video de la URL de YouTube
    const videoIdMatch = this.urlVideoYtb.match(
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );

    if (videoIdMatch) {
      this.videoId = videoIdMatch[1];
    } else {
      // Manejar el caso en el que la URL no sea válida
      this.videoId = '';
    }
  }

  redirigirIniciarVideoLearn() {
    this.router.navigate(['/learn/preguntas-video',{id: this.idVideoLearn, videolearn: this.nombreVideoLearn}]);
  }
}
