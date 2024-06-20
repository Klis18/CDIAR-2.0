import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { Nivel } from '../../interfaces/nivel.inteface';
import { RecursoService } from '../../services/recurso.service';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'resources-filters',
  templateUrl: './resource-filters.component.html',
  styles: ``,
})
export class ResourceFiltersComponent implements OnInit {

  nivelesType: { label: string; value: string }[] = [];
  asignaturas: { label: string; value: string }[] = [];
  nombreRecurso: string = '';
  resourceForm!: FormGroup;
  @Output() search = new EventEmitter();

  constructor(
    private recursoService: RecursoService,
    @Inject(FormBuilder) private formBuilder: FormBuilder
  ) {}

  builderForm() {
    this.resourceForm = this.formBuilder.group({
      nombreRecurso: [null],
      asignaturas: [null],
      nivelesType: [null],
    });
  }
  counter = 0;
  ngOnInit() {
    this.builderForm();
    this.loadNiveles();
    this.resourceForm.valueChanges.subscribe({
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
    this.resourceForm.get('nivelesType')?.valueChanges.subscribe({
      next: (level) => {
        console.log({ level });
        if (level) {
          this.onNivelChange(level);
        }
      },
    });
  }

  loadNiveles() {
    this.recursoService.getNiveles().subscribe((res: any) => {
      this.nivelesType = res.data.map((nivel: Nivel) => ({
        label: nivel.descripcion,
        value: nivel.idNivel,
      }));
    });
  }

  onNivelChange(selectedNivel: number) {
    this.recursoService
      .getAsignaturasPorNivel(selectedNivel)
      .subscribe((res: any) => {
        console.log(res.data);
        this.asignaturas = res.data.map((asignatura: any) => ({
          label: asignatura.nombre,
          value: asignatura.idAsignatura,
        }));
      });
  }



}
