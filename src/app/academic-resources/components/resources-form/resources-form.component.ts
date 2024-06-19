import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RecursoService } from '../../services/recurso.service';
import { Nivel } from '../../interfaces/nivel.inteface';
import { HomeService } from '../../../home/services/home.service';
import { ResourcesComponent } from '../../pages/resources/resources.component';
import { ROLES } from '../../interfaces/roles.interface';
import { RecursosIdEstados } from '../../interfaces/recurso.interface';

@Component({
  selector: 'app-resources-form',
  templateUrl: './resources-form.component.html',
  styles: ``,
})
export class ResourcesFormComponent implements OnInit, OnChanges {
  // @Input() formData: any;
  // @Output() editedDataEmitter = new EventEmitter<any>();
  // @Output() valueFormEmitter = new EventEmitter<boolean>();
  // @Output() asignaturaEmitter = new EventEmitter<any>();

  // rol: string = '';
  // observacion: string = '';
  // nombreRevisor: string = '';
  // idAsign: string = '';
  // idNiv: string = '';
  // idStatus: string = '';
  // descripcionNivel: string = '';
  // nombreAsignatura: string = '';
  // descripcionEstado: string = '';
  // tipoRecurso: string = '';
  // recursoGroupForm!: FormGroup;
  // nivelesType: { label: string; value: string }[] = [];
  // asignaturas: { label: string; value: string }[] = [];
  // estados: { label: string; value: string }[] = [];
  // docentes: { label: string; value: string }[] = [];
  // recursoFile: string | null = null;
  // extension: string = '';
  // datosRecursos!: any;
  // selectedTab: string = this.academic.selectedTab;
  // listadoExtensionesImagenes = ['jpg', 'jpeg', 'png'];
  // listadoExtensionesArchivos = [
  //   'docx',
  //   'pdf',
  //   'pptx',
  //   'xlsx',
  //   'txt',
  //   'doc',
  //   'ppt',
  //   'xls',
  //   'csv',
  // ];


  // constructor(
  //   private fb: FormBuilder,
  //   private recursoService: RecursoService,
  //   private academic: ResourcesComponent,
  //   private homeService: HomeService,
  // ) {}

  // ngOnInit() {

  //   this.createForm();
  //   this.loadNiveles();
  //   this.loadEstados();
  //   this.loadDocentes();
    
  //   if (this.formData) {
  //     console.log('formData', this.formData);
  //     this.setData(this.formData);
  //   }
      
  //     this.recursoGroupForm.valueChanges.subscribe(() => {
  //       console.log(this.recursoGroupForm.value);
  //       this.editedDataEmitter.emit(this.recursoGroupForm.value);
  //       this.valueFormEmitter.emit(this.recursoGroupForm.valid);
  //       this.asignaturaEmitter.emit(this.recursoGroupForm.value.idAsignatura);
  //     });
      
  //     this.homeService.obtenerDatosMenu().subscribe((user) => {
  //       this.rol = user.data.rol;
  //     });
  // }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes['formData']) {
  //     this.setData(changes['formData'].currentValue);
  //   }
  // };

  // createForm() {
  //   this.recursoGroupForm = this.fb.group({
  //     idRecurso: [],
  //     idNivel: [0, Validators.required],
  //     idAsignatura: [0, Validators.required],
  //     idEstado: [0, Validators.required],
  //     tipoRecurso: ['', Validators.required],
  //     enlaceDelRecurso: ['', Validators.required],
  //     nombreRecurso: ['', Validators.required],
  //     idDocenteRevisor: [''],
  //     observacion: [''],
  //   });

  // }

  // setData(data: any) {
  //   if (data && this.recursoGroupForm) {
  //     this.recursoGroupForm.patchValue({
  //       idRecurso: data.idRecurso,
  //       idNivel: data.idNivel,
  //       idAsignatura: data.idAsignatura,
  //       idEstado: data.idEstado,
  //       tipoRecurso: data.tipoRecurso,
  //       enlaceDelRecurso: data.enlaceDelRecurso,
  //       nombreRecurso: data.nombreRecurso,
  //       nombreRevisor: data.nombreRevisor,
  //       recurso: data.recurso,
  //       observacion: data.observacion,
  //       idDocenteRevisor: data.idDocenteRevisor,
  //     });

  //     this.getAsignaturasPorNivel(Number(data.idNivel));

  //     this.observacion = data.observacion;
  //     this.idAsign = data.idAsignatura;
  //     this.idNiv = data.idNivel;

  //   }
  // }


  // loadNiveles() {
  //   this.recursoService.getNiveles().subscribe((res: any) => {
  //     console.log('Niveles', res.data);

  //      let nivel = res.data.find((nivel: any) => nivel.idNivel === this.idNiv);
  //      this.descripcionNivel = nivel ? nivel.descripcion : null;
  //      console.log(this.descripcionNivel);

  //     this.nivelesType = res.data.map((nivel: Nivel) => ({
  //       label: nivel.descripcion,
  //       value: nivel.idNivel,
  //     }));
  //   });
  // }

  // loadEstados() {
  //   this.recursoService.getEstados().subscribe((res: any) => {
  //     this.estados = res.data.map((estado: any) => ({
  //       label: estado.descripcion,
  //       value: estado.idEstado,
  //     }));
  //   });
  // }

  // loadDocentes() {
  //   this.recursoService.getDocentes().subscribe((res: any) => {
  //     console.log('docentes', res.data);
  //     this.docentes = res.data.map((docente: any) => ({
  //       label: docente.nombresCompletos,
  //       value: docente.idDocente,  

  //     }));
  //   });
  // }

  // onNivelChange(event: Event) {
  //   const selectedNivel = Number((event.target as HTMLSelectElement).value);
  //   this.getAsignaturasPorNivel(selectedNivel);

    
  // }

  // getAsignaturasPorNivel(idNivel: number, callback?: () => void) {
  //   this.recursoService
  //     .getAsignaturasPorNivel(idNivel)
  //     .subscribe((res: any) => {
  //       console.log(res.data);

  //       let asignatura = res.data.find((asignatura: any) => asignatura.idAsignatura === this.idAsign);
  //       this.nombreAsignatura = asignatura ? asignatura.nombre : null;
  //       console.log(this.nombreAsignatura);

  //       this.asignaturas = res.data.map((asignatura: any) => ({
  //         label: asignatura.nombre,
  //         value: asignatura.idAsignatura,
  //       }));

  //       if (callback) {
  //         callback();
  //       }
  //     });
  //   const asignaturaControl = this.recursoGroupForm.get('idAsignatura');
  //   console.log(asignaturaControl);

  //   if (asignaturaControl) {
  //     asignaturaControl.markAsTouched();
  //     asignaturaControl.updateValueAndValidity();
  //   }
  
  // }

  // onFileChange(event: any) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => {
  //       this.recursoFile = (reader.result as string).split(',')[1];
  //       this.extension = file.name.split('.').pop() || '';
  //       if (
  //         !this.listadoExtensionesImagenes.includes(this.extension) &&
  //         !this.listadoExtensionesArchivos.includes(this.extension)
  //       ) {
  //         window.alert('La extensión del archivo no es permitida');
  //       }
  //     };
  //   }
  // }

  // isLink() {
  //   return this.recursoGroupForm.value.tipoRecurso === 'Link';
  // }

  // isFile() {
  //   return this.recursoGroupForm.value.tipoRecurso === 'Archivo';
  // }

  // resourceName(value: string): string {
  //   return value.split('/').slice(-1)[0] || '';
  // }

  // showObservacion(rol:string): boolean {
  //   const isStudent = rol === 'Estudiante' && this.observacion != '';
  //   const isDocente = rol === 'Docente';
  //   return isStudent || isDocente;

  // }

  // selectedActivate(rol:string): boolean{
  //   const isStudent = rol === 'Estudiante';
  //   const isDocente = rol === 'Docente';
  //   return isStudent || isDocente;
  // }

  // onlyViewACtivate(rol:string): boolean{
  //   const isDocente = rol === 'Docente' && this.selectedTab === 'Por Aprobar';
  //   const isAdmin = rol === 'Admin';
  //   return isDocente || isAdmin;
  // }

  // showStatus(rol:string): boolean {
  //   const isDocente = rol === 'Docente' && this.selectedTab === 'Por Aprobar';
  //   return isDocente;
  // }


  @Input() formData: any;
  @Input() modeForm!: 'Edit' | 'Add';
  @Output() editedDataEmitter = new EventEmitter<any>();
  @Output() valueFormEmitter = new EventEmitter<boolean>();
  @Output() asignaturaEmitter = new EventEmitter<any>();

  nivelesType: { label: string; value: string }[] = [];
  asignaturas: { label: string; value: string }[] = [];
  estados: { label: string; value: string }[] = [];
  docentes: { label: string; value: string }[] = [];
  recursoGroupForm!: FormGroup;
  recursoFile: string | null = null;
  descripcionEstado: string = '';
  nombreRevisor: string = '';
  observation: string = '';
  tipoRecurso: string = '';
  currentIdNivel!: number;
  extension: string = '';
  idStatus: string = '';
  idAsign: string = '';
  idNiv: string = '';
  rol: string = '';
  datosRecursos!: any;
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
    private recursoService: RecursoService,
    private homeService: HomeService
  ) {}

  ngOnInit() {
    this.homeService.obtenerDatosMenu().subscribe((user) => {
      if (user) this.rol = user.data.rol;
    });
    this.createForm();
    this.loadNiveles();
    this.loadEstados();
    this.loadDocentesRevision();

    if (this.formData) {
      console.log('formData', this.formData);
      this.setData(this.formData);
    }

    this.recursoGroupForm.get('tipoRecurso')?.valueChanges.subscribe({
      next: (tipoRecurso) => {
        if (tipoRecurso !== this.currentTypeResource) {
          this.currentTypeResource = tipoRecurso;
          if (tipoRecurso === 'Link') {
            this.recursoGroupForm.get('enlaceDelRecurso')?.enable();
          } else {
            this.recursoGroupForm.get('enlaceDelRecurso')?.reset();
            this.recursoGroupForm.get('enlaceDelRecurso')?.disable();
          }
        }
      },
    });
    this.recursoGroupForm.get('idEstado')?.valueChanges.subscribe({
      next: (idEstado) => {
        if (idEstado === RecursosIdEstados.ELIMINADO) {
          this.recursoGroupForm
            .get('observation')
            ?.setValidators([Validators.required]);
          this.recursoGroupForm.get('observation')?.updateValueAndValidity();
        }
      },
    });
    this.recursoGroupForm.get('idNivel')?.valueChanges.subscribe({
      next: (idNivel) => {
        console.log({ idNivelFF: idNivel });
        if (idNivel !== this.currentIdNivel) {
          this.currentIdNivel = idNivel;
          this.onNivelChange(idNivel);
        } else if (!idNivel) {
          this.asignaturas = [];
          this.recursoGroupForm.get('idAsignatura')?.reset();
        }
      },
    });

    this.recursoGroupForm.valueChanges.subscribe((res) => {
      console.log(this.recursoGroupForm.value);
      console.log({ resorce: this.recursoGroupForm });
      this.editedDataEmitter.emit(this.recursoGroupForm.value);
      this.valueFormEmitter.emit(this.recursoGroupForm.valid);
      this.asignaturaEmitter.emit(this.recursoGroupForm.value.idAsignatura);
    });
  }
  currentIdStatus!: number;
  currentTypeResource!: string;
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formData']) {
      this.setData(changes['formData'].currentValue);
    }
  }

  createForm() {
    this.recursoGroupForm = this.fb.group({
      idRecurso: [],
      idNivel: [null, Validators.required],
      idAsignatura: [null, Validators.required],
      idEstado: [null, Validators.required],
      tipoRecurso: ['', Validators.required],
      enlaceDelRecurso: ['', Validators.required],
      nombreRecurso: ['', Validators.required],
      idDocenteRevisor: ['', Validators.required],
      observation: ['', Validators.required],
    });
    switch (this.rol) {
      case ROLES.ADMIN:
        console.log('ADMIN');
        this.recursoGroupForm.get('idNivel')?.disable();
        this.recursoGroupForm.get('idAsignatura')?.disable();
        this.recursoGroupForm.get('idEstado')?.disable();
        this.recursoGroupForm.get('tipoRecurso')?.disable();
        this.recursoGroupForm.get('enlaceDelRecurso')?.disable();
        this.recursoGroupForm.get('nombreRecurso')?.disable();

        break;
      case ROLES.DOCENTE:
        console.log('DOCENTE');
        break;

      default:
        console.log('ESTUDIANTE');
        this.recursoGroupForm.get('observation')?.clearValidators();
        this.recursoGroupForm.get('observation')?.updateValueAndValidity();

        this.recursoGroupForm.get('idDocenteRevisor')?.clearValidators();
        this.recursoGroupForm.get('idDocenteRevisor')?.updateValueAndValidity();
        this.recursoGroupForm.get('idEstado')?.clearValidators();
        this.recursoGroupForm.get('idEstado')?.updateValueAndValidity();
        break;
    }
  }

  setData(data: any) {
    if (data && this.recursoGroupForm) {
      this.recursoGroupForm.patchValue({
        idRecurso: data.idRecurso,
        idNivel: data.idNivel,
        idAsignatura: data.idAsignatura,
        idEstado: data.idEstado,
        tipoRecurso: data.tipoRecurso,
        enlaceDelRecurso: data.enlaceDelRecurso,
        nombreRecurso: data.nombreRecurso,
        nombreRevisor: data.nombreRevisor,
        recurso: data.recurso,
        observation: data.observacion,
        idDocenteRevisor: data.idDocenteRevisor,
      });
      if (data?.idNivel) {
        this.getAsignaturasPorNivel(Number(data.idNivel));
      }

      this.observation = data.observacion;
      this.idAsign = data.idAsignatura;
      this.idNiv = data.idNivel;
    }
    if (this.rol === ROLES.DOCENTE) {
      this.recursoGroupForm.get('idDocenteRevisor')?.disable();
      this.recursoGroupForm.get('idDocenteRevisor')?.updateValueAndValidity();
    }
  }

  loadNiveles() {
    this.recursoService.getNiveles().subscribe((res: any) => {
      console.log('Niveles', { nivel: res.data });

      this.nivelesType = res.data.map((nivel: Nivel) => ({
        label: nivel.descripcion,
        value: nivel.idNivel,
      }));
    });
  }

  loadEstados() {
    this.recursoService.getEstados().subscribe((res: any) => {
      this.estados = res.data.map((estado: any) => ({
        label: estado.descripcion,
        value: estado.idEstado,
      }));
    });
  }

  loadDocentesRevision() {
    if (this.rol === 'Admin')
      this.recursoService.getDocentesRevision().subscribe((res: any) => {
        console.log('docentes', res.data);
        this.docentes = res.data.map((docente: any) => ({
          label: docente.nombresCompletos,
          value: docente.idDocente,
        }));
      });
  }

  onNivelChange(nivelId: number) {
    if (nivelId) this.getAsignaturasPorNivel(nivelId);
  }

  getAsignaturasPorNivel(idNivel: number, callback?: () => void) {
    this.recursoService
      .getAsignaturasPorNivel(idNivel)
      .subscribe((res: any) => {
        console.log({ assignNivel: res.data });

        this.asignaturas = res.data.map((asignatura: any) => ({
          label: asignatura.nombre,
          value: asignatura.idAsignatura,
        }));

        if (callback) {
          callback();
        }
      });
    const asignaturaControl = this.recursoGroupForm.get('idAsignatura');
    console.log({ asignaturaControl });

    if (asignaturaControl) {
      asignaturaControl.markAsTouched();
      asignaturaControl.updateValueAndValidity();
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.recursoFile = (reader.result as string).split(',')[1];
        this.extension = file.name.split('.').pop() || '';
        if (
          !this.listadoExtensionesImagenes.includes(this.extension) &&
          !this.listadoExtensionesArchivos.includes(this.extension)
        ) {
          //enviar mensaje error de que la extension no es permitida para imagenes
          window.alert('La extensión del archivo no es permitida');
        }
      };
    }
  }

  resourceName(value: string): string {
    return value.split('/').slice(-1)[0] || '';
  }

  showObservation(rol: string): boolean {
    const isStudent = rol === 'Estudiante' && this.observation != '';
    const isDocente = rol === 'Docente' && this.modeForm !== 'Add';
    return isStudent || isDocente;
  }

  selectedActivate(rol: string): boolean {
    let RolValid = false;
    if (rol === 'Estudiante' || rol === 'Docente') {
      RolValid = true;
    }
    return RolValid;
  }

  showStatus(rol: string): boolean {
    const isDocente = rol === 'Docente';
    return isDocente;
  }

}
