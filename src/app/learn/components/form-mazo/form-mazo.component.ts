import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HomeService } from '../../../home/services/home.service';
import { LearnService } from '../../services/learn.service';
import { Nivel } from '../../../academic-resources/interfaces/nivel.inteface';

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
  recursoFile: string | null = null;
  extension: string = '';
  nivelesType: { label: string; value: string }[] = [];
  asignaturas: { label: string; value: string }[] = [];
  estados: { label: string; value: string }[] = [];
  docentes: { label: string; value: string }[] = [];
  selectedTab: string = '';
  listadoExtensionesImagenes = ['jpg', 'jpeg', 'png'];
  listadoExtensionesArchivos = [
    'docx',
    'pdf',
    'pptx',
    'xlsx',
    'txt',
    'doc',
    'ppt',
    'xls',
    'csv',
  ];


  constructor(
    private fb: FormBuilder,
    private learnService: LearnService,
    private homeService: HomeService,
  ) {}

  ngOnInit() {

    this.createForm();
    this.loadNiveles();
    // this.loadEstados();
    
    if (this.formData) {
      this.setData(this.formData);
    }
      
      this.mazoGroupForm.valueChanges.subscribe(() => {
        this.editedDataEmitter.emit(this.mazoGroupForm.value);
        this.valueFormEmitter.emit(this.mazoGroupForm.valid);
        this.asignaturaEmitter.emit(this.mazoGroupForm.value.idAsignatura);
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
    this.mazoGroupForm = this.fb.group({
      idMazo: [],
      idNivel: [0, Validators.required],
      idAsignatura: [0, Validators.required],
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
        // idEstado: data.idEstado,
        nombreMazo: data.nombreMazo,
      });

      this.getAsignaturasPorNivel(Number(data.idNivel));

      // this.observacion = data.observacion;
      this.idAsign = data.idAsignatura;
      this.idNiv = data.idNivel;

    }
  }

  loadNiveles() {
    this.learnService.getNiveles().subscribe((res: any) => {

       //Extaer descripción de nivel
       let nivel = res.data.find((nivel: any) => nivel.idNivel === this.idNiv);
       this.descripcionNivel = nivel ? nivel.descripcion : null;
       //Fin de la extracción

      this.nivelesType = res.data.map((nivel: Nivel) => ({
        label: nivel.descripcion,
        value: nivel.idNivel,
      }));
    });
  }


  onNivelChange(event: Event) {
    const selectedNivel = Number((event.target as HTMLSelectElement).value);
    this.getAsignaturasPorNivel(selectedNivel);

    
  }

  getAsignaturasPorNivel(idNivel: number, callback?: () => void) {
    this.learnService
      .getAsignaturasPorNivel(idNivel)
      .subscribe((res: any) => {

        //Extaer el nombre de la asignatura
        let asignatura = res.data.find((asignatura: any) => asignatura.idAsignatura === this.idAsign);
        this.nombreAsignatura = asignatura ? asignatura.nombre : null;
        //Fin de la extracción

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
    // const isDocente = rol === 'Docente' && this.selectedTab === 'Mis Recursos';
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
