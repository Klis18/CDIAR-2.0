import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HomeService } from '../../../home/services/home.service';
import { LearnService } from '../../services/learn.service';
import { Nivel } from '../../../academic-resources/interfaces/nivel.inteface';
import { debounceTime, Subscription } from 'rxjs';

@Component({
  selector: 'app-form-mazo',
  templateUrl: './form-mazo.component.html',
  styles: ``
})
export class FormMazoComponent implements OnInit, OnChanges{
  @Input() formData: any;
  @Input() modeForm!: 'Edit' | 'Add' | 'Por Aprobar';
  @Output() editedDataEmitter = new EventEmitter<any>();
  @Output() valueFormEmitter = new EventEmitter<boolean>();
  @Output() asignaturaEmitter = new EventEmitter<any>();
  
  rol: string = '';
  observacion: string = '';
  descripcionNivel: string = '';
  nombreAsignatura: string = '';
  idAsign: string = '';
  idNiv: string = '';
  mazoGroupForm!: FormGroup;
  currentIdNivel!: number;
  nivelesType: { label: string; value: string }[] = [];
  asignaturas: { label: string; value: string }[] = [];
  estados: { label: string; value: string }[] = [];
  docentes: { label: string; value: string }[] = [];
  selectedTab: string = '';

  private subscriptions: Subscription[] = [];


  constructor(
    private fb: FormBuilder,
    private learnService: LearnService,
    private homeService: HomeService,
  ) {}


  ngOnInit() {
    this.createForm();
    this.loadNiveles();


    if (this.formData) {
      this.setData(this.formData);
    }

    this.mazoGroupForm.get('idNivel')?.valueChanges.subscribe({
      next: (idNivel) => {
        if (idNivel !== this.currentIdNivel) {
          this.currentIdNivel = idNivel;
          this.onNivelChange(idNivel);
        } else if (!idNivel) {
          this.asignaturas = [];
          this.mazoGroupForm.get('idAsignatura')?.reset();
        }
      },
    });

    this.subscriptions.push(
      this.mazoGroupForm.valueChanges.pipe(
        debounceTime(300) 
      ).subscribe(() => {
        this.editedDataEmitter.emit(this.mazoGroupForm.value);
        this.valueFormEmitter.emit(this.mazoGroupForm.valid);
        this.asignaturaEmitter.emit(this.mazoGroupForm.value.idAsignatura);

      })
    );


    this.subscriptions.push(
      this.homeService.obtenerDatosMenu().subscribe((user) => {
        this.rol = user.data.rol;
      })
    );
  }

 
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formData']) {
      this.setData(changes['formData'].currentValue);
    }
  };


  createForm() {
    this.mazoGroupForm = this.fb.group({
      idMazo: [],
      idNivel: [, Validators.required],
      idAsignatura: [, Validators.required],
      idEstado: [0, Validators.required],
      nombreMazo: ['', Validators.required],
      
    });

  }

  setData(data: any) {
    if (data && this.mazoGroupForm) {
      this.mazoGroupForm.patchValue({
        idMazo: data.idMazo,
        idNivel: data.idNivel,
        idAsignatura: data.idAsignatura,
        nombreMazo: data.nombreMazo,
      });

      if (data?.idNivel) {
        this.getAsignaturasPorNivel(Number(data.idNivel));
      }
      
      this.idAsign = data.idAsignatura;
      this.idNiv = data.idNivel;

    }
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
    const asignaturaControl = this.mazoGroupForm.get('idAsignatura');
    if (asignaturaControl) {
      asignaturaControl.markAsTouched();
      asignaturaControl.updateValueAndValidity();
    }
  }

  


  selectedActivate(rol:string): boolean{
    const isStudent = rol === 'Estudiante';
    const isDocente = rol === 'Docente';
    return isStudent || isDocente;
  }

  onlyViewACtivate(rol:string): boolean{
    const isDocente = rol === 'Docente' && this.selectedTab === 'Por Aprobar';
    const isAdmin = rol === 'Admin';
    return isDocente || isAdmin;
  }

  showStatus(rol:string): boolean {
    const isDocente = rol === 'Docente' && this.selectedTab === 'Por Aprobar';
    return isDocente;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: { unsubscribe: () => any; }) => sub.unsubscribe());
  }


}
