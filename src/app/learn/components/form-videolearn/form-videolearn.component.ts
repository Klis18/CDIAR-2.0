import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, Subscription } from 'rxjs';
import { VideolearnService } from '../../services/videolearn.service';
import { HomeService } from '../../../home/services/home.service';
import { SharedService } from '../../../shared/services/shared.service';
import { Nivel } from '../../../shared/interfaces/nivel.interface';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { videoYtb } from '../../interfaces/videolearn.interface';
import { Asignatura } from '../../../academic-resources/interfaces/asignatura.inteface';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-form-videolearn',
  templateUrl: './form-videolearn.component.html',
  styles: `
  `,
})
export class FormVideolearnComponent {
  @Input() formData: any;
  @Input() modeForm!: 'Edit' | 'Add' | 'Por Aprobar';
  @Output() editedDataEmitter = new EventEmitter<any>();
  @Output() valueFormEmitter = new EventEmitter<boolean>();
  @Output() asignaturaEmitter = new EventEmitter<any>();

  rol: string = '';
  descripcionNivel: string = '';
  nombreAsignatura: string = '';
  idAsign: string = '';
  idNiv: string = '';
  videolearnGroupForm!: FormGroup;
  currentIdNivel!: number;
  nivelesType: { label: string; value: string }[] = [];
  asignaturas: { label: string; value: string }[] = [];
  selectedTab: string = '';
  idVideoYtb: string | null = '';
  valor: string = '';
  enlaceVideoYtb: string = '';
  videoId: string = '';
  alertaVideo: string = '';
  urlVideo: string = '';
  urlValid: boolean = false;

  width = window.innerWidth;
  height = window.innerHeight;

  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private videolearnService: VideolearnService,
    private sharedService: SharedService,
    private homeService: HomeService
  ) {}

  ngOnInit() {
    this.createForm();
    this.loadNiveles();

    if (this.formData) {
      this.setData(this.formData);
    }

    this.videolearnGroupForm.get('idNivel')?.valueChanges.subscribe({
      next: (idNivel) => {
        if (idNivel !== this.currentIdNivel) {
          this.currentIdNivel = idNivel;
          this.onNivelChange(this.currentIdNivel);
        } else if (!idNivel) {
          this.asignaturas = [];
          this.videolearnGroupForm.get('idAsignatura')?.reset();
        }
      },
    });

    this.subscriptions.push(
      this.videolearnGroupForm.valueChanges
        .pipe(
          debounceTime(300) 
        )
        .subscribe(() => {
          this.editedDataEmitter.emit(this.videolearnGroupForm.value);
          this.urlVideo = this.videolearnGroupForm.value.enlaceVideo;
          this.valueFormEmitter.emit(this.videolearnGroupForm.valid);
          this.asignaturaEmitter.emit(
            this.videolearnGroupForm.value.idAsignatura
          );
        })
    );

    this.subscriptions.push(
      this.homeService.obtenerDatosMenu().subscribe((user) => {
        this.rol = user.data.rol;
      })
    );
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formData']) {
      this.setData(changes['formData'].currentValue);
    }
  }

  createForm() {
    this.videolearnGroupForm = this.fb.group({
      idVideoLearn: [],
      idNivel: [, Validators.required],
      idAsignatura: [, Validators.required],
      nombreVideoLearn: ['', Validators.required],
      enlaceVideo: ['', Validators.required],
    });
  }

  setData(data: any) {
    if (data && this.videolearnGroupForm) {
      this.videolearnGroupForm.patchValue({
        idVideoLearn: data.idVideoLearn,
        idNivel: data.idNivel,
        idAsignatura: data.idAsignatura,
        nombreVideoLearn: data.nombreVideoLearn,
        enlaceVideo: data.enlaceVideo,
      });

      if (data?.idNivel) {
        this.getAsignaturasPorNivel(Number(data.idNivel));
      }

      this.idAsign = data.idAsignatura;
      this.idNiv = data.idNivel;
    }
  }

  loadNiveles() {
    this.sharedService.getNiveles().subscribe((res: any) => {
      this.nivelesType = res.data.map((nivel: Nivel) => ({
        label: nivel.descripcion,
        value: nivel.idNivel,
      }));
    });
  }

  onNivelChange(nivelId: number) {
    if (nivelId) 
      this.getAsignaturasPorNivel(nivelId);
  }

  getAsignaturasPorNivel(idNivel: number, callback?: () => void) {
    this.sharedService.getAsignaturasPorNivel(idNivel).subscribe((res:any) => {
      this.asignaturas = res.data.map((asignatura: any) => ({
        label: asignatura.nombre,
        value: asignatura.idAsignatura,
      }));

      if (callback) {
        callback();
      }
    },(error)=>{
      this.asignaturas = [];
    });
    const asignaturaControl = this.videolearnGroupForm.get('idAsignatura');
    if (asignaturaControl) {
      asignaturaControl.markAsTouched();
      asignaturaControl.updateValueAndValidity();
    }
  }

  selectedActivate(rol: string): boolean {
    const isStudent = rol === 'Estudiante';
    const isDocente = rol === 'Docente';
    return isStudent || isDocente;
  }

  onlyViewACtivate(rol: string): boolean {
    const isDocente = rol === 'Docente' && this.selectedTab === 'Por Aprobar';
    const isAdmin = rol === 'Admin';
    return isDocente || isAdmin;
  }

  showStatus(rol: string): boolean {
    const isDocente = rol === 'Docente' && this.selectedTab === 'Por Aprobar';
    return isDocente;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: { unsubscribe: () => any }) =>
      sub.unsubscribe()
    );
  }

  updateVideoId() {
    const videoIdMatch = this.enlaceVideoYtb.match(
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );

    if (videoIdMatch) {
      this.videoId = videoIdMatch[1];
    } else {
      this.videoId = '';
    }
  }

  verifyDurationVideo() {
    const video: videoYtb = {
      url: this.urlVideo,
    };

    this.videolearnService
      .verifyYtbVideoDuration(video)
      .subscribe((res: any) => {
        if (res.statusCode === 200) {
          this.urlValid = true;
          this.alertaVideo = 'El video es válido';
        } else {
          this.urlValid = false;
          this.alertaVideo =
            'El video no es válido, solo se aceptan videos de youtube de 10 minutos o menos';
        }
      });
  }
}
