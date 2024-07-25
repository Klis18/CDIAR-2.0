import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CargaHorariaDocenteService } from '../../services/carga-horaria-docente.service';

@Component({
  selector: 'carga-horaria-form',
  templateUrl: './carga-horaria-form.component.html',
  styles: ``
})
export class CargaHorariaFormComponent {
  @Input() formData!: any;
  @Output() valueFormEmitter = new EventEmitter<boolean>();
  @Output() cargaHorariaEmitter = new EventEmitter<string[]>();
  
  diasSemana: { label: string; value: string }[] = [];
  cargaGroupForm!: FormGroup;
  newData: string[] = [];
  idCargaAdd: number = 0;
  public cargaDia: {diaSemana:string, actividad: string, horaDesde: string, horaHasta:string}[] = [];

  

  constructor(
    private cargaHoraria: CargaHorariaDocenteService,
    private fb: FormBuilder,
  ) {}


  ngOnInit(){
    this.createForm();
    this.loadDiasSemana();   
    this.setData(this.formData);  
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
        diaSemana: data.idDiaSemana,
        actividad: data.actividad,
        horaDesde: data.horaDesde,
        horaHasta: data.horaHasta,
      });
    }
  }

  agregarCargaLista(){
    let diaSemanaControl = this.cargaGroupForm.get('diaSemana');
    let actividadControl = this.cargaGroupForm.get('actividad');
    let horaDesdeControl = this.cargaGroupForm.get('horaDesde');
    let horaHastaControl = this.cargaGroupForm.get('horaHasta');

    let diaSemana = diaSemanaControl ? diaSemanaControl.value : null;
    let actividad = actividadControl ? actividadControl.value : null;
    let horaDesde = horaDesdeControl ? horaDesdeControl.value : null;
    let horaHasta = horaHastaControl ? horaHastaControl.value : null;

    this.cargaDia.push({diaSemana, actividad, horaDesde, horaHasta});

    this.valueFormEmitter.emit(this.cargaGroupForm.valid);
    this.cargaGroupForm.reset();
  }

  recibirDatos(datos: string[]) {
    this.newData = datos;
    this.cargaHorariaEmitter.emit(this.newData);
  }
}
