import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  inject,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RecursoService } from '../../services/recurso.service';
import { Nivel } from '../../interfaces/nivel.inteface';
import { HomeService } from '../../../home/services/home.service';
import { ResourcesComponent } from '../../pages/resources/resources.component';
import { ROLES } from '../../interfaces/roles.interface';
import { ModeFormsResources,RecursosIdEstados } from '../../interfaces/recurso.interface';

@Component({
  selector: 'app-resources-form',
  templateUrl: './resources-form.component.html',
  styles: ``,
})
export class ResourcesFormComponent implements OnInit, OnChanges {
  @Input() formData: any;
  @Input() modeForm!: ModeFormsResources;
  @Output() editedDataEmitter = new EventEmitter<any>();
  @Output() valueFormEmitter = new EventEmitter<boolean>();
  @Output() asignaturaEmitter = new EventEmitter<any>();

  @ViewChild('fileInput') fileInput!: ElementRef;

  nivelesType: { label: string; value: string }[] = [];
  asignaturas: { label: string; value: string }[] = [];
  estados: { label: string; value: string }[] = [];
  docentes: { label: string; value: string }[] = [];
  recursoGroupForm!: FormGroup;
  descripcionEstado: string = '';
  currentTypeResource!: string;
  nombreRevisor: string = '';
  observation: string = '';
  tipoRecurso: string = '';
  currentIdStatus!: number;
  currentIdNivel!: number;
  idStatus: string = '';
  idAssign: string = '';
  datosRecursos!: any;
  idNiv: string = '';
  rol: string = '';
  recursoCargado:string = 'HOLA';
  listadoExtensionesImages = ['jpg', 'jpeg', 'png'];
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
    this.createForm();
    this.loadNiveles();
    this.loadEstados();
    this.homeService.obtenerDatosMenu().subscribe({
      next: (user) => {
        if (user) this.rol = user.data?.rol;
        this.validationsForm();
        this.loadDocentesRevision();
        this.ngSuscribesOnInit();

        if (this.formData) {
          this.setData(this.formData);
        }
      },
      error: () => {
        window.alert('No cargo la información del Usuario Administrador');
      },
    });
  }

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
      recurso: [null, Validators.required],
      recursoCargado: [null, Validators.required],
      extension: [null],
      observation: ['', Validators.required],
      observationArchivo: [null, Validators.required],
      extensionObservaciones: [null, Validators.required],
    });
  }

  validationsForm() {
    switch (this.rol) {
      case ROLES.ADMIN:
        this.recursoGroupForm.get('idNivel')?.disable();
        this.recursoGroupForm.get('idAsignatura')?.disable();
        this.recursoGroupForm.get('idEstado')?.disable();
        this.recursoGroupForm.get('tipoRecurso')?.disable();
        this.recursoGroupForm.get('enlaceDelRecurso')?.disable();
        this.recursoGroupForm.get('nombreRecurso')?.disable();
        this.recursoGroupForm.get('idDocenteRevisor')?.updateValueAndValidity();

        this.recursoGroupForm.get('observation')?.clearValidators();
        this.recursoGroupForm.get('observation')?.updateValueAndValidity();

        this.recursoGroupForm.get('observationArchivo')?.clearValidators();
        this.recursoGroupForm
          .get('observationArchivo')
          ?.updateValueAndValidity();

        this.recursoGroupForm.get('extensionObservaciones')?.clearValidators();
        this.recursoGroupForm
          .get('extensionObservaciones')
          ?.updateValueAndValidity();

        break;
      case ROLES.DOCENTE:
        if (this.modeForm === 'Add') {
          this.recursoGroupForm.get('idEstado')?.clearValidators();
          this.recursoGroupForm.get('idEstado')?.updateValueAndValidity();
          this.recursoGroupForm.get('idDocenteRevisor')?.clearValidators();
          this.recursoGroupForm
            .get('idDocenteRevisor')
            ?.updateValueAndValidity();
          this.recursoGroupForm.get('observation')?.clearValidators();
          this.recursoGroupForm.get('observation')?.updateValueAndValidity();

          this.recursoGroupForm.get('observationArchivo')?.clearValidators();
          this.recursoGroupForm
            .get('observationArchivo')
            ?.updateValueAndValidity();

          this.recursoGroupForm
            .get('extensionObservaciones')
            ?.clearValidators();
          this.recursoGroupForm
            .get('extensionObservaciones')
            ?.updateValueAndValidity();
        } else if (
          this.modeForm === 'Edit' ||
          this.modeForm === 'Por Aprobar'
        ) {
          this.recursoGroupForm.get('idDocenteRevisor')?.clearValidators();
          this.recursoGroupForm
            .get('idDocenteRevisor')
            ?.updateValueAndValidity();
          this.recursoGroupForm.get('observation')?.clearValidators();
          this.recursoGroupForm.get('observation')?.updateValueAndValidity();

          this.recursoGroupForm.get('observationArchivo')?.clearValidators();
          this.recursoGroupForm
            .get('observationArchivo')
            ?.updateValueAndValidity();

          this.recursoGroupForm
            .get('extensionObservaciones')
            ?.clearValidators();
          this.recursoGroupForm
            .get('extensionObservaciones')
            ?.updateValueAndValidity();
        }
        break;

      default:
        this.recursoGroupForm.get('observation')?.clearValidators();
        this.recursoGroupForm.get('observation')?.updateValueAndValidity();

        this.recursoGroupForm.get('observationArchivo')?.clearValidators();
        this.recursoGroupForm
          .get('observationArchivo')
          ?.updateValueAndValidity();

        this.recursoGroupForm.get('extensionObservaciones')?.clearValidators();
        this.recursoGroupForm
          .get('extensionObservaciones')
          ?.updateValueAndValidity();

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
        recursoCargado: data.recurso,
        observation: data.observacion,
        idDocenteRevisor: data.idDocenteRevisor,
      });
      if (data?.idNivel) {
        this.getAsignaturasPorNivel(Number(data.idNivel));
      }
      
      if (this.rol === ROLES.ESTUDIANTE) {
        console.log({ FORM: this.modeForm });
        if (this.modeForm === 'Edit') {
          this.recursoGroupForm.get('observation')?.disable();
          this.recursoGroupForm.get('observation')?.updateValueAndValidity();

          this.recursoGroupForm.get('idDocenteRevisor')?.disable();
          this.recursoGroupForm
            .get('idDocenteRevisor')
            ?.updateValueAndValidity();

          this.recursoGroupForm.get('observationArchivo')?.disable();
          this.recursoGroupForm
            .get('observationArchivo')
            ?.updateValueAndValidity();

          this.recursoGroupForm.get('extensionObservaciones')?.disable();
          this.recursoGroupForm
            .get('extensionObservaciones')
            ?.updateValueAndValidity();
        }

        if (this.modeForm === 'Corregir Recurso') {
          this.recursoGroupForm.get('idDocenteRevisor')?.disable();
          this.recursoGroupForm
            .get('idDocenteRevisor')
            ?.updateValueAndValidity();
        }
      }
      this.observation = data.observacion;
      this.idAssign = data.idAsignatura;
      this.idNiv = data.idNivel;
    }

    if (this.rol === ROLES.ADMIN) {
      this.recursoGroupForm.get('enlaceDelRecurso')?.disable();
    }

    if (this.rol === ROLES.DOCENTE) {
      this.recursoGroupForm.get('idDocenteRevisor')?.disable();
      this.recursoGroupForm.get('idDocenteRevisor')?.updateValueAndValidity();
      this.recursoGroupForm.get('observation')?.disable();
      this.recursoGroupForm.get('observation')?.updateValueAndValidity();

      if (this.modeForm === 'Por Aprobar') {
        this.recursoGroupForm.get('observation')?.enable();
        this.recursoGroupForm.get('observation')?.updateValueAndValidity();

        this.recursoGroupForm.disable();
        this.recursoGroupForm.get('idEstado')?.enable();

        this.recursoGroupForm.get('idNivel')?.disable();
        this.recursoGroupForm.get('idAsignatura')?.disable();
        this.recursoGroupForm.get('tipoRecurso')?.disable();
        this.recursoGroupForm.get('enlaceDelRecurso')?.disable();
        this.recursoGroupForm.get('nombreRecurso')?.disable();
      }
    }
  }

  loadNiveles() {
    this.recursoService.getNiveles().subscribe((res: any) => {
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
        this.asignaturas = res.data.map((asignatura: any) => ({
          label: asignatura.nombre,
          value: asignatura.idAsignatura,
        }));

        if (callback) {
          callback();
        }
      });
    const asignaturaControl = this.recursoGroupForm.get('idAsignatura');
    if (asignaturaControl) {
      asignaturaControl.markAsTouched();
      asignaturaControl.updateValueAndValidity();
    }
  }

  onFileChange(event: any, field: 'recurso' | 'observationArchivo') {
    let extensionField: string = '';
    if (field === 'recurso') extensionField = 'extension';
    if (field === 'observationArchivo')
      extensionField = 'extensionObservaciones';

    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const recursoFile = (reader.result as string).split(',')[1];
        if (recursoFile)
          this.recursoGroupForm.get(field)?.setValue(recursoFile);
          this.recursoGroupForm.get('recursoCargado')?.setValue(file.name);
        const extension = file.name.split('.').pop() || '';

        if (
          !this.listadoExtensionesImages.includes(extension) &&
          !this.listadoExtensionesArchivos.includes(extension)
        ) {
          this.recursoGroupForm.get(extensionField)?.reset();
          this.recursoGroupForm.get(field)?.reset();
        } else if (extension)
          this.recursoGroupForm.get(extensionField)?.setValue(extension);
      };
    }
  }

  resourceName(value: string): string {
    return value.split('/').slice(-1)[0] || '';
  }
  observationView: boolean = false;
  showObservation(rol: string): boolean {
    const isStudent = rol === 'Estudiante' && this.observation !== '';
    const isDocente =
      rol === 'Docente' &&
      (this.modeForm === 'Edit' || this.modeForm === 'Por Aprobar') &&
      (this.observation !== '' || this.observationView);

    let status = false;
    if (rol === 'Estudiante') status = isStudent;
    if (rol === 'Docente') status = isDocente;

    return status;
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

  canShowStatus() {
    let status: boolean = false;
    if (this.rol === 'Docente') {
      status = this.modeForm === 'Edit' || this.modeForm === 'Por Aprobar';
    }

    if (this.rol === 'Estudiante') {
      status = this.modeForm === 'Corregir Recurso';
    }

    return status;
  }
  ngSuscribesOnInit() {
    this.recursoGroupForm.get('tipoRecurso')?.valueChanges.subscribe({
      next: (tipoRecurso) => {
        if (tipoRecurso !== this.currentTypeResource) {
          this.currentTypeResource = tipoRecurso;
          if (tipoRecurso === 'Link') {
            this.recursoGroupForm.get('enlaceDelRecurso')?.enable();
            this.recursoGroupForm.get('recurso')?.reset();
            this.recursoGroupForm.get('recurso')?.disable();
            this.recursoGroupForm.get('extension')?.reset();
            this.recursoGroupForm.get('extension')?.disable();
          } else {
            this.recursoGroupForm.get('recurso')?.enable();
            this.recursoGroupForm.get('extension')?.enable();
            this.recursoGroupForm.get('enlaceDelRecurso')?.reset();
            this.recursoGroupForm.get('enlaceDelRecurso')?.disable();
          }
        }
      },
    });

    this.recursoGroupForm.get('idEstado')?.valueChanges.subscribe({
      next: (idEstado) => {
        if (idEstado === RecursosIdEstados.RECHAZADO) {
          this.recursoGroupForm
            .get('observation')
            ?.setValidators([Validators.required]);
          this.observationView = true;
          this.recursoGroupForm.get('observation')?.enable();
          this.recursoGroupForm.get('observation')?.updateValueAndValidity();

          this.recursoGroupForm
            .get('observationArchivo')
            ?.setValidators([Validators.required]);
          this.recursoGroupForm.get('observationArchivo')?.enable();
          this.recursoGroupForm
            .get('extensionObservaciones')
            ?.setValidators([Validators.required]);
          this.recursoGroupForm.get('extensionObservaciones')?.enable();
        } else {
          this.recursoGroupForm.get('observation')?.reset();
          this.recursoGroupForm.get('observation')?.clearValidators();
          this.recursoGroupForm.get('observationArchivo')?.reset();
          this.recursoGroupForm.get('observationArchivo')?.clearValidators();
          this.recursoGroupForm.get('extensionObservaciones')?.reset();
          this.recursoGroupForm
            .get('extensionObservaciones')
            ?.clearValidators();
          this.observationView = false;
        }
        this.recursoGroupForm.get('observation')?.updateValueAndValidity();
        this.recursoGroupForm
          .get('observationArchivo')
          ?.updateValueAndValidity();
        this.recursoGroupForm
          .get('extensionObservaciones')
          ?.updateValueAndValidity();
      },
    });
    this.recursoGroupForm.get('idNivel')?.valueChanges.subscribe({
      next: (idNivel) => {
        if (idNivel !== this.currentIdNivel) {
          this.currentIdNivel = idNivel;
          this.onNivelChange(idNivel);
        } else if (!idNivel) {
          this.asignaturas = [];
          this.recursoGroupForm.get('idAsignatura')?.reset();
        }
      },
    });

    this.recursoGroupForm.valueChanges.subscribe(() => {
      const response = {
        idRecurso: this.recursoGroupForm.get('idRecurso')?.value,
        idNivel: this.recursoGroupForm.get('idNivel')?.value,
        idAsignatura: this.recursoGroupForm.get('idAsignatura')?.value,
        idEstado: this.recursoGroupForm.get('idEstado')?.value,
        tipoRecurso: this.recursoGroupForm.get('tipoRecurso')?.value,
        enlaceDelRecurso: this.recursoGroupForm.get('enlaceDelRecurso')?.value,
        nombreRecurso: this.recursoGroupForm.get('nombreRecurso')?.value,
        nombreRevisor: this.recursoGroupForm.get('nombreRevisor')?.value,
        recurso: this.recursoGroupForm.get('recurso')?.value,
        observation: this.recursoGroupForm.get('observation')?.value,
        idDocenteRevisor: this.recursoGroupForm.get('idDocenteRevisor')?.value,
        observacionesArchivo:
          this.recursoGroupForm.get('observationArchivo')?.value,
        extensionObservaciones: this.recursoGroupForm.get(
          'extensionObservaciones'
        )?.value,
        extension: this.recursoGroupForm.get('extension')?.value,
      };
      console.log({ form: this.recursoGroupForm, response });
      this.editedDataEmitter.emit(response);
      this.valueFormEmitter.emit(this.recursoGroupForm.valid);
      this.asignaturaEmitter.emit(this.recursoGroupForm.value.idAsignatura);
    });
  }

  selectFile(): void {
    // Simula un clic en el input de tipo file oculto
    this.fileInput.nativeElement.click();
  }
}
