import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CargaHorariaDocenteService } from '../../services/carga-horaria-docente.service';

@Component({
  selector: 'carga-horaria-form',
  templateUrl: './carga-horaria-form.component.html',
  styles: ``
})
export class CargaHorariaFormComponent {

  @Output() valueFormEmitter = new EventEmitter<boolean>();
  @Output() cargaHorariaEmitter = new EventEmitter<string[]>();
  // @Input() idCarga: number = 0;
  
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
    // this.recursoService.getNiveles().subscribe((res: any) => {
    //   this.nivelesType = res.data.map((nivel: Nivel) => ({
    //     label: nivel.descripcion,
    //     value: nivel.idNivel,
    //   }));
    // });
  }

  agregarCargaLista(){
    // Obtención de los valores de los campos del formulario
    let diaSemanaControl = this.cargaGroupForm.get('diaSemana');
    let actividadControl = this.cargaGroupForm.get('actividad');
    let horaDesdeControl = this.cargaGroupForm.get('horaDesde');
    let horaHastaControl = this.cargaGroupForm.get('horaHasta');

    let diaSemana = diaSemanaControl ? diaSemanaControl.value : null;
    let actividad = actividadControl ? actividadControl.value : null;
    let horaDesde = horaDesdeControl ? horaDesdeControl.value : null;
    let horaHasta = horaHastaControl ? horaHastaControl.value : null;

    // Agregación de la pregunta y respuesta al arreglo
    this.cargaDia.push({diaSemana, actividad, horaDesde, horaHasta});

    console.log(this.cargaDia);
    // Limpieza de los campos del formulario
    this.valueFormEmitter.emit(this.cargaGroupForm.valid);
    this.cargaGroupForm.reset();
  }

  recibirDatos(datos: string[]) {
    this.newData = datos;
    this.cargaHorariaEmitter.emit(this.newData);
    console.log('EMITTER',this.newData);
  }
}
