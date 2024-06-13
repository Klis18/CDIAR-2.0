import { Component, OnInit } from '@angular/core';
import { Mazo } from '../../interfaces/mazo.interface';
import { LearnService } from '../../services/learn.service';

interface DataItem {
  title: string;
  content: string;
}

@Component({
  selector: 'cards-flashcards',
  templateUrl: './cards-flashcards.component.html',
  styles: ``
})
export class CardsFlashcardsComponent implements OnInit{

  data: Mazo[] =[];
  colors = ['#67E8A2', '#67E8DA', '#C883F1', '#CB48A0', '#7FCDE8', '#E4E87F', '#E8BB7F']; // Puedes cambiar estos colores

  //constructor(private http: HttpClient) {}
  constructor(private learnService:LearnService) {}

  ngOnInit() {
    this.listaMazos();
    
  }

  listaMazos(){
    this.learnService.getMazos().subscribe((res:any) => {
      this.data = res.data;
      console.log(this.data);
    });
  }

  getGradient(index: number) {
    const color1 = this.colors[index % this.colors.length];
    const color2 = this.colors[(index + 1) % this.colors.length];
    return `linear-gradient(to right, ${color1} 0%, ${color2} 100%)`;
  }

}
