import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { cargaHoraria } from '../../interfaces/carga-horaria.interface';
import { Validators } from 'ngx-editor';
import { CargaHorariaDocenteService } from '../../services/carga-horaria-docente.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, Subscription } from 'rxjs';

@Component({
  selector: 'edit-carga-horaria-form',
  templateUrl: './edit-carga-horaria-form.component.html',
  styles: ``
})
export class EditCargaHorariaFormComponent {
  @Input() formData!: any;
  @Output() valueFormEmitter = new EventEmitter<boolean>();
  @Output() editedDataEmitter = new EventEmitter<string[]>();
  
  diasSemana: { label: string; value: string }[] = [];
  cargaGroupForm!: FormGroup;
  
  private subscriptions: Subscription[] = [];


  constructor(
    private cargaHoraria: CargaHorariaDocenteService,
    private fb: FormBuilder,
  ) {}


  ngOnInit(){
    this.createForm();
    this.loadDiasSemana();   
    if(this.formData){
      this.setData(this.formData);  
    }

    this.subscriptions.push(
      this.cargaGroupForm.valueChanges.pipe(
        debounceTime(300)
      ).subscribe(() => { 
        this.editedDataEmitter.emit(this.cargaGroupForm.value);
        this.valueFormEmitter.emit(this.cargaGroupForm.valid);
      })

    );

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['formData']) {
      this.setData(changes['formData'].currentValue);
    }
  }


  createForm() {
    this.cargaGroupForm = this.fb.group({
      diaSemana: ['', Validators.required],
      actividad: ['', Validators.required],
      horaDesde: ['', Validators.required],
      horaHasta: ['', Validators.required],
    });

  }

  loadDiasSemana() {
    this.cargaHoraria.getDiasSemana().subscribe((res: any) => {
      this.diasSemana = res.data.map((dia: {idDiaSemana: number, nombre: string}) => ({
        label: dia.nombre,
        value: dia.idDiaSemana,
      }));
    });
  }

  setData(data: any) {
    if (data && this.cargaGroupForm) {
      this.cargaGroupForm.patchValue({
        diaSemana: data.diaSemanaNumero,
        actividad: data.actividad,
        horaDesde: data.horaDesde,
        horaHasta: data.horaHasta,
      });
    }
  }
}
