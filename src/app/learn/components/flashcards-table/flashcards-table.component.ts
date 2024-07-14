import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { LearnService } from '../../services/learn.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'flashcards-table',
  templateUrl: './flashcards-table.component.html',
  styles: ``
})
export class FlashcardsTableComponent implements OnInit,OnChanges{

  
  @Input() idMazo: number = 0;
  @Input() flashcards: any[] = [];
  @Output() flashcardsAdd = new EventEmitter<string[]>();

  data: any[] = [];

  constructor(private learnService: LearnService) { }

  ngOnInit(){
    this.flashcards;
    
  }

  ngOnChanges(changes: SimpleChanges){
    if(changes['flashcards']){
      this.flashcardsAdd.emit(this.flashcards);    
    }
  }

  eliminarItem(index:number){
    this.flashcards.splice(index, 1);
  }



}
