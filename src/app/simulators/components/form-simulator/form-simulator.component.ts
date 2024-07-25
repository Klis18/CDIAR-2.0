import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SimulatorsService } from '../../services/simulators.service';
import { HomeService } from '../../../home/services/home.service';
import { Nivel } from '../../../shared/interfaces/nivel.interface';

@Component({
  selector: 'form-simulator',
  templateUrl: './form-simulator.component.html',
  styles: ``
})
export class FormSimulatorComponent {
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
  simulatorGroupForm!: FormGroup;
  nivelesType: { label: string; value: string }[] = [];
  asignaturas: { label: string; value: string }[] = [];
  estados: { label: string; value: string }[] = [];
  selectedTab: string = '';
  currentIdNivel!: number;
  


  constructor(
    private fb: FormBuilder,
    private simulatorService: SimulatorsService,
    private homeService: HomeService,
  ) {}

  ngOnInit() {

    this.createForm();
    this.loadNiveles();
    
    if (this.formData) {
      this.setData(this.formData);
    }

    this.simulatorGroupForm.get('idNivel')?.valueChanges.subscribe({
      next: (idNivel) => {
        if (idNivel !== this.currentIdNivel) {
          this.currentIdNivel = idNivel;
          this.onNivelChange(idNivel);
        } else if (!idNivel) {
          this.asignaturas = [];
          this.simulatorGroupForm.get('idAsignatura')?.reset();
        }
      },
    });
      
      this.simulatorGroupForm.valueChanges.subscribe(() => {
        this.editedDataEmitter.emit(this.simulatorGroupForm.value);
        this.valueFormEmitter.emit(this.simulatorGroupForm.valid);
        this.asignaturaEmitter.emit(this.simulatorGroupForm.value.idAsignatura);
      });
      
      this.homeService.obtenerDatosMenu().subscribe((user) => {
        this.rol = user.data.rol;
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formData']) {
      this.setData(changes['formData'].currentValue);
    }
  };


  createForm() {
    this.simulatorGroupForm = this.fb.group({
      idSimulador: [],
      idNivel: [, Validators.required],
      idAsignatura: [, Validators.required],
      nombreSimulador: ['', Validators.required],
    });

  }

  setData(data: any) {
    if (data && this.simulatorGroupForm) {
      this.simulatorGroupForm.patchValue({
        idSimulador: data.idSimulador,
        idNivel: data.idNivel,
        idAsignatura: data.idAsignatura,
        nombreSimulador: data.nombreSimulador,
      });

      this.getAsignaturasPorNivel(Number(data.idNivel));

      this.idAsign = data.idAsignatura;
      this.idNiv = data.idNivel;

    }
  }

  loadNiveles() {
    this.simulatorService.getNiveles().subscribe((res: any) => {
       let nivel = res.data.find((nivel: any) => nivel.idNivel === this.idNiv);
       this.descripcionNivel = nivel ? nivel.descripcion : null;

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
    this.simulatorService
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
    const asignaturaControl = this.simulatorGroupForm.get('idAsignatura');
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

}
