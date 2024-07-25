import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CargaHorariaDocenteService } from '../../services/carga-horaria-docente.service';

@Component({
  selector: 'carga-horaria-filters',
  templateUrl: './carga-horaria-filters.component.html',
  styles: ``
})
export class CargaHorariaFiltersComponent {
  
  diasSemana: { label: string; value: string }[] = [];
  actividad: string = '';
  filterForm!: FormGroup;
  @Output() search = new EventEmitter();

  constructor(
    private cargaHorariaService: CargaHorariaDocenteService,
    @Inject(FormBuilder) private formBuilder: FormBuilder
  ) {}

  builderForm() {
    this.filterForm = this.formBuilder.group({
      actividad: [null],
      diasSemana: [null],
    });
  }
  counter = 0;
  ngOnInit() {
    this.builderForm();
    this.loadDiasSemana();
    this.filterForm.valueChanges.subscribe({
      next: (res) => {
        this.counter++;
        setTimeout(() => {
          this.counter--;
          if (this.counter === 0) {
            this.search.emit(res);
          }
        }, 500);
      },
    });
  }

  loadDiasSemana() {
    this.cargaHorariaService.getDiasSemana().subscribe((res: any) => {
      this.diasSemana = res.data.map((dia: {idDiaSemana: number, nombre: string}) => ({
        label: dia.nombre,
        value: dia.idDiaSemana,
      }));
    });
  }


}
