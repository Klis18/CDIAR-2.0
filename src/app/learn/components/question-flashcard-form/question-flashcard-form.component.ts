import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'question-flashcard-form',
  templateUrl: './question-flashcard-form.component.html',
  styles: ``
})
export class QuestionFlashcardFormComponent implements OnInit{

  @Output() valueFormEmitter = new EventEmitter<boolean>();
  @Output() flashcardEmitter = new EventEmitter<string[]>();
  @Input() idMazo: number = 0;
  
  questionGroupForm!: FormGroup;
  newData: string[] = [];
  idMazoAdd: number = 0;
  public preguntasRespuestas: {idMazo:number, pregunta: string, respuesta: string}[] = [];

  

  constructor(
    private fb: FormBuilder,
  ) {}


  ngOnInit(){
    this.createForm();     
  }


  createForm() {
    this.questionGroupForm = this.fb.group({
      pregunta: ['', Validators.required],
      respuesta: ['', Validators.required],
    });

  }

  agregarPreguntaLista(){
    let preguntaControl = this.questionGroupForm.get('pregunta');
    let respuestaControl = this.questionGroupForm.get('respuesta');

    let idMazo = this.idMazo;
    let pregunta = preguntaControl ? preguntaControl.value : null;
    let respuesta = respuestaControl ? respuestaControl.value : null;

    this.preguntasRespuestas.push({idMazo, pregunta, respuesta});

    this.valueFormEmitter.emit(this.questionGroupForm.valid);
    this.questionGroupForm.reset();
  }

  recibirDatos(datos: string[]) {
    this.newData = datos;
    this.flashcardEmitter.emit(this.newData);
  }
}
