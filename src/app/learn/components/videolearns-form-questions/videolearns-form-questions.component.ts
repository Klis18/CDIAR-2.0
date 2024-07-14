import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ModeFormsResources } from '../../../academic-resources/interfaces/recurso.interface';
import { editQuestionsVideolearn, opcionesRespuestas } from '../../interfaces/videolearn.interface';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, Subscription } from 'rxjs';
import { VideolearnService } from '../../services/videolearn.service';
import { HomeService } from '../../../home/services/home.service';

@Component({
  selector: 'app-videolearns-form-questions',
  templateUrl: './videolearns-form-questions.component.html',
  styles: ``
})
export class VideolearnsFormQuestionsComponent implements OnInit{
  @Input() formData!: editQuestionsVideolearn;
  @Input() modeForm!: ModeFormsResources;
  @Input() id!: number;
  @Output() editedDataEmitter = new EventEmitter<any>();
  @Output() valueFormEmitter = new EventEmitter<boolean>();
  @Output() asignaturaEmitter = new EventEmitter<any>();
  @Input() onlyView!: boolean;

  asignaturas: { label: string; value: string }[] = [];
  videolearnQuestionGroupForm!: FormGroup;
  rol: string = '';
  nivel: string = '';
  asignatura: string = '';
  nombreVideoLearn: string = '';

  private subscriptions: Subscription[] = [];


  opcionesRespuestas: opcionesRespuestas[] = [];
  selectedOption: string = '';
  radioSeleccionado1:boolean = false;
  radioSeleccionado2:boolean = false;
  radioSeleccionado3:boolean = false;
  radioSeleccionado4:boolean = false;


  constructor(
    private fb: FormBuilder,
    private videolearnService: VideolearnService,
    private homeService: HomeService
  ) {}

  ngOnInit() {
    this.createForm();
    this.obtenerDatosVideoLearn(this.id);
    this.homeService.obtenerDatosMenu().subscribe({
      next: (user) => {
        if (user) this.rol = user.data?.rol;
       // this.ngSuscribesOnInit();

        if (this.formData) {
          console.log('Data desde preguntas simulador', this.formData);
          this.setData(this.formData);
          if(this.onlyView == false){
            this.videolearnQuestionGroupForm.disable();
          }
        }
      },
      error: () => {
        window.alert('No cargo la información del Usuario Administrador');
      },
    });

    this.subscriptions.push(
      this.videolearnQuestionGroupForm.valueChanges.pipe(
        debounceTime(300)  // Ejemplo de debounce para reducir peticiones
      ).subscribe(() => {
        this.clickControllers();
      
        this.opcionesRespuestas=[
          {respuesta: this.videolearnQuestionGroupForm.get('opcionSimple1')?.value, esCorrecta: this.radioSeleccionado1},
          {respuesta: this.videolearnQuestionGroupForm.get('opcionSimple2')?.value, esCorrecta:  this.radioSeleccionado2},
          {respuesta: this.videolearnQuestionGroupForm.get('opcionSimple3')?.value, esCorrecta:  this.radioSeleccionado3},
          {respuesta: this.videolearnQuestionGroupForm.get('opcionSimple4')?.value, esCorrecta:  this.radioSeleccionado4},
        ]
      

      
      const response = {
        idVideoLearn: this.id,
        pregunta: this.videolearnQuestionGroupForm.get('pregunta')?.value,
        opcionesRespuestas: this.opcionesRespuestas,
      };
      

      this.editedDataEmitter.emit(response);
      this.valueFormEmitter.emit(this.videolearnQuestionGroupForm.valid);

      })
    );
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['formData']) {
      this.setData(changes['formData'].currentValue);
      this.clickControllers();
    }
  }

  createForm() {
    this.videolearnQuestionGroupForm = this.fb.group({
      pregunta: ['', Validators.required],
      opcionSimple1: [''],
      opcionSimple2: [''],
      opcionSimple3: [''],
      opcionSimple4: [''],

      radio1: new FormControl(false),
      radio2: new FormControl(false),
      radio3: new FormControl(false),
      radio4: new FormControl(false),

     
    });
  }

  obtenerDatosVideoLearn(idVideolearn: number ){
    this.videolearnService.getVideoLearn(idVideolearn).subscribe((res)=>{
      this.nivel = res.data.nivel;
      this.asignatura = res.data.asignatura;
    });
  }

idPregunta:number = 0;

  setData(data: any) {
    if (data && this.videolearnQuestionGroupForm) {

      this.videolearnQuestionGroupForm.patchValue({
        pregunta: data.pregunta,
        idTipoPregunta: data.idTipoPregunta,
      });
      
        this.radioSeleccionado1 = data.opcionesRespuestas[0].esCorrecta;
        this.radioSeleccionado2 = data.opcionesRespuestas[1].esCorrecta;
        this.radioSeleccionado3 = data.opcionesRespuestas[2].esCorrecta;
        this.radioSeleccionado4 = data.opcionesRespuestas[3].esCorrecta;

        this.videolearnQuestionGroupForm.patchValue({
          opcionSimple1: data.opcionesRespuestas[0].respuesta,
          opcionSimple2: data.opcionesRespuestas[1].respuesta,
          opcionSimple3: data.opcionesRespuestas[2].respuesta,
          opcionSimple4: data.opcionesRespuestas[3].respuesta,
        });
      
      this.idPregunta = data.idPregunta;
    }
  }

  selectedActivate(rol: string): boolean {
    let RolValid = false;
    if (rol === 'Estudiante' || rol === 'Docente') {
      RolValid = true;
    }
    return RolValid;
  }
  
  // tipoPreguntaSeleccionada: any;
  // questionType: number = 0;


  // onChange(option:any) {
  //   this.tipoPreguntaSeleccionada = option;
  //   this.questionType = option.value;

  // }
  
  clickControllers(){
    document.getElementById('radio1')?.addEventListener('click', () => {
      this.radioSeleccionado1 = true;
      this.radioSeleccionado2 = false;
      this.radioSeleccionado3 = false;
      this.radioSeleccionado4 = false;
    });
    document.getElementById('radio2')?.addEventListener('click', () => {
      this.radioSeleccionado2 = true;
      this.radioSeleccionado1 = false;
      this.radioSeleccionado3 = false;
      this.radioSeleccionado4 = false;
    });
    document.getElementById('radio3')?.addEventListener('click', () => {
      this.radioSeleccionado3 = true;
      this.radioSeleccionado1 = false;
      this.radioSeleccionado2 = false;
      this.radioSeleccionado4 = false;
    });
    document.getElementById('radio4')?.addEventListener('click', () => {
      this.radioSeleccionado4 = true;
      this.radioSeleccionado1 = false;
      this.radioSeleccionado2 = false;
      this.radioSeleccionado3 = false;
    });
    
  }
 

  
}
