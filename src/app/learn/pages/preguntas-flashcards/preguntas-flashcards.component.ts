import { Component, Input } from '@angular/core';
import { LearnService } from '../../services/learn.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-preguntas-flashcards',
  templateUrl: './preguntas-flashcards.component.html',
  styles: ``
})
export class PreguntasFlashcardsComponent {
  // @Input() nombreMazo: string='';

  nombreMazo: string = '';
  idMazo: number = 0;

  constructor(private learnService: LearnService, private route: ActivatedRoute) { }

  ngOnInit() {
    // this.learnService.nombreMazoActual.subscribe(nombreMazo => this.nombreMazo = nombreMazo);
    this.route.params.subscribe(params => {
      this.nombreMazo = params['mazo'];
      this.idMazo = params['id'];
      // console.log(data);
    });
  }

}
