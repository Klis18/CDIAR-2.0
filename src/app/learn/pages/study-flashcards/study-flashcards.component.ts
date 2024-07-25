import { Component, HostListener, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LearnService } from '../../services/learn.service';
import { Flashcard, updateSiguienteRepasoFlashcard } from '../../interfaces/mazo.interface';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-study-flashcards',
  templateUrl: './study-flashcards.component.html',
  styles: `
    .flashcard-view{
      background-image: url('/assets/images/bgflashcard.jpg');
      background-size: cover;
    }
  `
})
export class StudyFlashcardsComponent implements OnInit, OnDestroy{

  nombreMazo: string = '';
  idMazo: number = 0;

  flashcardsMazo: Flashcard[] = [];
  currentFlashcard: Flashcard | null = null;
  showAnswer: boolean = false;
  subscription: Subscription | null = null;
  entradaPagina: Date | null = null;
  tiempoEnPagina: number = 0;
  intervaloTiempo: any; 
  nuevaFecha: Date = new Date();


  constructor(private route: ActivatedRoute, private learnService: LearnService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.nombreMazo = params['mazo'];
      this.idMazo = params['id'];
    });

    this.cargarFlashcards();
    this.iniciarRepeticion();
     this.entradaPagina = new Date();
     this.intervaloTiempo = setInterval(() => {
       this.tiempoEnPagina = Math.floor((new Date().getTime() - this.entradaPagina!.getTime()) / 1000);
     }, 1000);
  
  }

  cargarFlashcards() {
    this.learnService.estudiarMazoGuardado(this.idMazo).subscribe((res: any) => {
      this.flashcardsMazo = res.data;
      this.procesarSiguienteFlashcard();
    });
  }

  procesarSiguienteFlashcard() {
    const now = new Date();
    const flashcardsDisponibles = this.flashcardsMazo.filter(f => new Date(f.siguienteRepaso) <= now);
    
    if (flashcardsDisponibles.length > 0) {
      this.currentFlashcard = flashcardsDisponibles[0];
    } else {
      this.currentFlashcard = null;
    }
  }
                  
  toggleAnswer(): void {
    this.showAnswer = !this.showAnswer;
  }

  
toLocalISOString(date: Date): string {
  const tzoffset = date.getTimezoneOffset() * 60000;
  const localISOTime = (new Date(date.getTime() - tzoffset)).toISOString().slice(0,-1);
  return localISOTime;
}

actualizarRepasoFlashcard(minutos: number): void {
  if (this.currentFlashcard) {
      let ahora = new Date();
      this.nuevaFecha = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), ahora.getHours(), ahora.getMinutes() + minutos);
      
      let nuevaFechaISO = this.toLocalISOString(this.nuevaFecha);

      const flashcard: updateSiguienteRepasoFlashcard = {
          idFlashcard: this.currentFlashcard.idFlashcard,
          siguienteRepaso: nuevaFechaISO
      };


      this.learnService.actualizarRepasoFlashcardsGuardadas(flashcard).subscribe(res => {
        this.showAnswer = false;
        this.cargarFlashcards();
      });
  }
}

  iniciarRepeticion() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.subscription = interval(60000).subscribe(() => {
      this.cargarFlashcards();
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

   clearInterval(this.intervaloTiempo);
   this.tiempoEnPagina = 0;
   this.entradaPagina = null;
 
  }

  formatoTiempo(segundos: number): string {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segundosRestantes = segundos % 60;
    return `${this.agregarCero(horas)}:${this.agregarCero(minutos)}:${this.agregarCero(segundosRestantes)}`;
  }

  agregarCero(numero: number): string {
    return numero < 10 ? `0${numero}` : `${numero}`;
  }

  @HostListener('window:focus')
  onFocus() {
    if (!this.entradaPagina) {
      this.entradaPagina = new Date();
      this.intervaloTiempo = setInterval(() => {
        this.tiempoEnPagina = Math.floor((new Date().getTime() - this.entradaPagina!.getTime()) / 1000);
      }, 1000);
    }
  }

  @HostListener('window:blur')
  onBlur() {
    clearInterval(this.intervaloTiempo);
    this.tiempoEnPagina = 0;
    this.entradaPagina = null;
  }
}
