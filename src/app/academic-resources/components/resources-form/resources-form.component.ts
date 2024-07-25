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
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RecursoService } from '../../services/recurso.service';
import { Nivel } from '../../interfaces/nivel.inteface';
import { HomeService } from '../../../home/services/home.service';
import { ModeFormsResources} from '../../interfaces/recurso.interface';

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

  resourceType: { label: string; value: string }[] = [
    { label: 'Link', value: 'Link' },
    { label: 'Archivo', value: 'Archivo' },
  ];
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
    this.homeService.obtenerDatosMenu().subscribe({
      next: (user) => {
        if (user) this.rol = user.data?.rol
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
      tipoRecurso: [, Validators.required],
      enlaceDelRecurso: ['', Validators.required],
      nombreRecurso: ['', Validators.required],
      recurso: [null],
      recursoCargado: [null],
      extension: [null],
    });
  }

  setData(data: any) {
    if (data && this.recursoGroupForm) {
      this.recursoGroupForm.patchValue({
        idRecurso: data.idRecurso,
        idNivel: data.idNivel,
        idAsignatura: data.idAsignatura,
        tipoRecurso: data.tipoRecurso,
        enlaceDelRecurso: data.enlaceDelRecurso,
        nombreRecurso: data.nombreRecurso,
        recursoCargado: data.recurso,
      });
      if (data?.idNivel) {
        this.getAsignaturasPorNivel(Number(data.idNivel));
      }
      
     
      this.idAssign = data.idAsignatura;
      this.idNiv = data.idNivel;
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
        tipoRecurso: this.recursoGroupForm.get('tipoRecurso')?.value,
        enlaceDelRecurso: this.recursoGroupForm.get('enlaceDelRecurso')?.value,
        nombreRecurso: this.recursoGroupForm.get('nombreRecurso')?.value,
        nombreRevisor: this.recursoGroupForm.get('nombreRevisor')?.value,
        recurso: this.recursoGroupForm.get('recurso')?.value,
      
        extension: this.recursoGroupForm.get('extension')?.value,
      };
      this.editedDataEmitter.emit(response);
      this.valueFormEmitter.emit(this.recursoGroupForm.valid);
      this.asignaturaEmitter.emit(this.recursoGroupForm.value.idAsignatura);
    });
  }

  selectFile(): void {
    this.fileInput.nativeElement.click();
  }
}
