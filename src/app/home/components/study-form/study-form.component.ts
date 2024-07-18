import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LearnService } from '../../../learn/services/learn.service';
import { Subscription } from 'rxjs';
import { Nivel } from '../../../shared/interfaces/nivel.interface';
import { SimulatorsService } from '../../../simulators/services/simulators.service';
import { NewMazo } from '../../../learn/interfaces/mazo.interface';
import { NewSimulator } from '../../../simulators/interfaces/simulators.interface';
import { SpinnerService } from '../../../shared/services/spinner.service';

@Component({
  selector: 'study-form',
  templateUrl: './study-form.component.html',
  styles: ``
})
export class StudyFormComponent {
  // @Output() editedDataEmitter = new EventEmitter<any>();
  // @Output() valueFormEmitter = new EventEmitter<boolean>();
  // @Output() asignaturaEmitter = new EventEmitter<any>();
  
  observacion: string = '';
  descripcionNivel: string = '';
  nombreAsignatura: string = '';
  idAsign: string = '';
  idNiv: string = '';
  generateGroupForm!: FormGroup;
  currentIdNivel!: number;
  nivelesType: { label: string; value: string }[] = [];
  asignaturas: { label: string; value: string }[] = [];
 
  private subscriptions: Subscription[] = [];


  constructor(
    private fb: FormBuilder,
    private learnService: LearnService,
    private simulatorService:SimulatorsService,
    private spinnerService: SpinnerService
  ) {}


  ngOnInit() {
    this.createForm();
    this.loadNiveles();


    this.generateGroupForm.get('idNivel')?.valueChanges.subscribe({
      next: (idNivel) => {
        if (idNivel !== this.currentIdNivel) {
          this.currentIdNivel = idNivel;
          this.onNivelChange(idNivel);
        } else if (!idNivel) {
          this.asignaturas = [];
          this.generateGroupForm.get('idAsignatura')?.reset();
        }
      },
    });


  }

 
  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes['formData']) {
  //     this.setData(changes['formData'].currentValue);
  //   }
  // };


  createForm() {
    this.generateGroupForm = this.fb.group({
      idNivel: [0, Validators.required],
      idAsignatura: [0, Validators.required],
      tema: ['', Validators.required],
      flashcardsCheckbox: [false],
      simuladoresCheckbox: [false],
      // idEstado: [0, Validators.required],
      // nombreMazo: ['', Validators.required],   
    });

  }

  loadNiveles() {
    this.learnService.getNiveles().subscribe((res: any) => {
      this.nivelesType = res.data.map((nivel: Nivel) => ({
        label: nivel.descripcion,
        value: nivel.idNivel,
      }));
    });
  }


  onNivelChange(nivelId: number) {
    if (nivelId) this.getAsignaturasPorNivel(nivelId);
  }

  getAsignaturasPorNivel(idNivel: number, callback?: () => void) {
    this.learnService
      .getAsignaturasPorNivel(idNivel)
      .subscribe((res: any) => {
        this.asignaturas = res.data.map((asignatura: any) => ({
          label: asignatura.nombre,
          value: asignatura.idAsignatura,
        }));

        if (callback) {
          callback();
        }
      });
    const asignaturaControl = this.generateGroupForm.get('idAsignatura');
    if (asignaturaControl) {
      asignaturaControl.markAsTouched();
      asignaturaControl.updateValueAndValidity();
    }
  }



  generateFlashcards(){
    if(!this.generateGroupForm.valid){
      console.log('DATOS INCOMPLETOS');
      return;
    }
    const mazo: NewMazo = {
      idNivel: this.generateGroupForm.value.idNivel,
      idAsignatura: this.generateGroupForm.value.idAsignatura,
      nombreMazo: this.generateGroupForm.value.tema,
    }
    this.spinnerService.showSpinner();

    console.log('Mazo: ', mazo);
    this.learnService.generarFlashcardsIa(mazo).subscribe((res) => {
      console.log('Mazo creado con IA: ', res);
      this.spinnerService.hideSpinner();
    },
    (error) => {
          console.error('Error al generar flashcards: ', error);
          // Asegúrate de desactivar el spinner en caso de error también
          this.spinnerService.hideSpinner();
        }
    );
  }

  generateSimulador(){
    if(!this.generateGroupForm.valid){
      console.log('DATOS DE SIMULADOR INCOMPLETOS');
      return;
    }
  
    const simulator: NewSimulator = {
      idNivel: this.generateGroupForm.value.idNivel,
      idAsignatura: this.generateGroupForm.value.idAsignatura,
      nombreSimulador: this.generateGroupForm.value.tema,
    }
    this.spinnerService.showSpinner();

    console.log('Simulador: ', simulator);

    this.simulatorService.generateSimulator(simulator)
    .subscribe((res) => {
      console.log('Simulador creado: ', res);
      this.spinnerService.hideSpinner();
    },
    (error) => {
      console.error('Error al generar simuladores: ', error);
      // Asegúrate de desactivar el spinner en caso de error también
      this.spinnerService.hideSpinner();
    }
  );

  }


  generarMateriales(){
    console.log('Generando materiales...');
    console.log('Flashcards form: ', this.generateGroupForm.value.flashcardsCheckbox);
    console.log('Simuladores form: ', this.generateGroupForm.value.simuladoresCheckbox);
    if(this.generateGroupForm.value.flashcardsCheckbox === true && this.generateGroupForm.value.simuladoresCheckbox === true){
      console.log('Generando flashcards');
      this.generateFlashcards();
      console.log('Generando simulador');
      this.generateSimulador();
      this.limpiarCampos();
    }
    else if(this.generateGroupForm.value.flashcardsCheckbox === true && this.generateGroupForm.value.simuladoresCheckbox === false){
      this.generateFlashcards();
      this.limpiarCampos();
    }else if(this.generateGroupForm.value.flashcardsCheckbox === false && this.generateGroupForm.value.simuladoresCheckbox === true){
      this.generateSimulador();
      this.limpiarCampos();
    }
  }

  limpiarCampos(){
    this.generateGroupForm.reset();
  }

}
