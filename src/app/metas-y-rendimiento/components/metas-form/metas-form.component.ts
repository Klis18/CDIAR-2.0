import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, Subscription } from 'rxjs';
import { MetasYRendimientoService } from '../../services/metas-y-rendimiento.service';
import { SharedService } from '../../../shared/services/shared.service';
import { Nivel } from '../../../shared/interfaces/nivel.interface';

@Component({
  selector: 'metas-form',
  templateUrl: './metas-form.component.html',
  styles: ``
})
export class MetasFormComponent implements OnInit, OnChanges {
  @Input() formData!: any;
  @Input() readonlyPuntaje!: boolean;
  @Output() valueFormEmitter = new EventEmitter<boolean>();
  @Output() editedDataEmitter = new EventEmitter<string[]>();
  @Output() asignaturaEmitter = new EventEmitter<any>();

  
  nivelesType: { label: string; value: string }[] = [];
  asignaturas: { label: string; value: string }[] = [];
  metasGroupForm!: FormGroup;
  currentIdNivel!: number;

  
  private subscriptions: Subscription[] = [];


  constructor(
    private metas: MetasYRendimientoService,
    private sharedService: SharedService,
    private fb: FormBuilder,
  ) {}


  ngOnInit(){
    this.createForm();
    this.loadNiveles();
    if(this.formData){
      this.setData(this.formData);  
    }

    this.subscriptions.push(
      this.metasGroupForm.valueChanges.pipe(
        debounceTime(300)
      ).subscribe(() => {   
        this.editedDataEmitter.emit(this.metasGroupForm.value);
        this.valueFormEmitter.emit(this.metasGroupForm.valid);
        this.asignaturaEmitter.emit(this.metasGroupForm.value.idAsignatura);
      })

    );

    this.metasGroupForm.get('idNivel')?.valueChanges.subscribe({
      next: (idNivel) => {
        if (idNivel !== this.currentIdNivel) {
          this.currentIdNivel = idNivel;
          this.onNivelChange(idNivel);
        } else if (!idNivel) {
          this.asignaturas = [];
          this.metasGroupForm.get('idAsignatura')?.reset();
        }
      },
    });

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['formData']) {
      this.setData(changes['formData'].currentValue);
    }
  }


  createForm() {
    this.metasGroupForm = this.fb.group({
      idAsignatura: [0, Validators.required],
      idNivel:[0, Validators.required] ,
      calificacionPrimerParcial: [0],
      puntajeObjetivo:[0],
      calificacionSegundoParcial: [0]
    });
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
    if (nivelId) this.getAsignaturasPorNivel(nivelId);
  }

  getAsignaturasPorNivel(idNivel: number, callback?: () => void) {
    this.sharedService
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
    const asignaturaControl = this.metasGroupForm.get('idAsignatura');
    if (asignaturaControl) {
      asignaturaControl.markAsTouched();
      asignaturaControl.updateValueAndValidity();
    }
  }

  setData(data: any) {
    if (data && this.metasGroupForm) {
      this.metasGroupForm.patchValue({
        idAsignatura: data.idAsignatura,
        idNivel:data.idNivel ,
        calificacionPrimerParcial: data.calificacionPrimerParcial ,
        puntajeObjetivo:data.puntajeObjetivo,
        calificacionSegundoParcial: data.calificacionSegundoParcial
      });
      if (data?.idNivel) {
        this.getAsignaturasPorNivel(Number(data.idNivel));
      }
    }
  }
}
