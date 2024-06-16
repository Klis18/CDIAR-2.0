import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HomeService } from '../../../home/services/home.service';
import { LearnService } from '../../services/learn.service';

@Component({
  selector: 'question-flashcard-form',
  templateUrl: './question-flashcard-form.component.html',
  styles: ``
})
export class QuestionFlashcardFormComponent implements OnInit{

  // @Input() formData: any;
  // @Output() editedDataEmitter = new EventEmitter<any>();
  // @Output() valueFormEmitter = new EventEmitter<boolean>();
  // @Output() asignaturaEmitter = new EventEmitter<any>();
  @Output() flashcardEmitter = new EventEmitter<string[]>();
  @Input() idMazo: number = 0;
  
  rol: string = '';
  observacion: string = '';
  questionGroupForm!: FormGroup;
  estados: { label: string; value: string }[] = [];
  docentes: { label: string; value: string }[] = [];
  selectedTab: string = '';
  newData: string[] = [];
  idMazoAdd: number = 0;
  

  constructor(
    private fb: FormBuilder,
    private learnService: LearnService,
    private homeService: HomeService,
  ) {}


  ngOnInit(){
    this.createForm(); 
    console.log('ID MAZO', this.idMazo);
  }


  createForm() {
    this.questionGroupForm = this.fb.group({
      pregunta: ['', Validators.required],
      respuesta: ['', Validators.required],
    });

  }

  // Declaración del arreglo donde se almacenarán las preguntas y respuestas
public preguntasRespuestas: {idMazo:number, pregunta: string, respuesta: string}[] = [];



  agregarPreguntaLista(){
    // Obtención de los valores de los campos del formulario
    let preguntaControl = this.questionGroupForm.get('pregunta');
    let respuestaControl = this.questionGroupForm.get('respuesta');

    let idMazo = this.idMazo;
    let pregunta = preguntaControl ? preguntaControl.value : null;
    let respuesta = respuestaControl ? respuestaControl.value : null;

    // Agregación de la pregunta y respuesta al arreglo
    this.preguntasRespuestas.push({idMazo, pregunta, respuesta});

    console.log(this.preguntasRespuestas);

    // Limpieza de los campos del formulario
    this.questionGroupForm.reset();
  }

  recibirDatos(datos: string[]) {
    this.newData = datos;
    this.flashcardEmitter.emit(this.newData);
    console.log('DATOS RECIBIDOS', this.newData);
  }
}
