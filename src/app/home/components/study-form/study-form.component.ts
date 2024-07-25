import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LearnService } from '../../../learn/services/learn.service';
import { Subscription } from 'rxjs';
import { Nivel } from '../../../shared/interfaces/nivel.interface';
import { SimulatorsService } from '../../../simulators/services/simulators.service';
import { NewMazo } from '../../../learn/interfaces/mazo.interface';
import { NewSimulator } from '../../../simulators/interfaces/simulators.interface';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { MatDialog } from '@angular/material/dialog';
import { CardMessageComponent } from '../../../shared/pages/card-message/card-message.component';
import { Router } from '@angular/router';

@Component({
  selector: 'study-form',
  templateUrl: './study-form.component.html',
  styles: ``
})
export class StudyFormComponent {
  
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
    private spinnerService: SpinnerService,
    private dialog: MatDialog,
    private router: Router
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


  createForm() {
    this.generateGroupForm = this.fb.group({
      idNivel: [, Validators.required],
      idAsignatura: [, Validators.required],
      tema: ['', Validators.required],
      flashcardsCheckbox: [false],
      simuladoresCheckbox: [false],   
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
      return;
    }
    const mazo: NewMazo = {
      idNivel: this.generateGroupForm.value.idNivel,
      idAsignatura: this.generateGroupForm.value.idAsignatura,
      nombreMazo: this.generateGroupForm.value.tema,
    }
    this.spinnerService.showSpinner();

    this.learnService.generarFlashcardsIa(mazo).subscribe((res) => {
      this.spinnerService.hideSpinner();
      this.router.navigate(['/learn/flashcards']);
    },
    (error) => {
        this.spinnerService.hideSpinner();
        this.dialog.open(CardMessageComponent, {
          width: '80%',
          maxWidth: '500px',
          maxHeight: '80%',
          data: {status:'error', mensaje: 'Error al generar flashcards'},
        });
      }
    );
  }

  generateSimulador(){
    if(!this.generateGroupForm.valid){
      return;
    }
  
    const simulator: NewSimulator = {
      idNivel: this.generateGroupForm.value.idNivel,
      idAsignatura: this.generateGroupForm.value.idAsignatura,
      nombreSimulador: this.generateGroupForm.value.tema,
    }
    this.spinnerService.showSpinner();


    this.simulatorService.generateSimulator(simulator)
    .subscribe((res) => {
      this.spinnerService.hideSpinner();
    },
    (error) => {
      this.spinnerService.hideSpinner();
      this.dialog.open(CardMessageComponent, {
        width: '80%',
        maxWidth: '500px',
        maxHeight: '80%',
        data: {status:'error' ,mensaje: 'Error al generar simulador'},
      });
    }
  );

  }


  generarMateriales(){
    if(this.generateGroupForm.value.flashcardsCheckbox === true && this.generateGroupForm.value.simuladoresCheckbox === true){
      this.generateFlashcards();
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
