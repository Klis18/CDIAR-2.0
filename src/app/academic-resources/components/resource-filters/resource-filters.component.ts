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
  // nivelesType: { label: string; value: string }[] = [];
  // asignaturas: { label: string; value: string }[] = [];
  // nombreRecurso: string = '';

  // constructor(private recursoService: RecursoService) {}

  // ngOnInit() {
  //   this.loadNiveles();
  // }

  // loadNiveles() {
  //   this.recursoService.getNiveles().subscribe((res: any) => {
  //     this.nivelesType = res.data.map((nivel: Nivel) => ({
  //       label: nivel.descripcion,
  //       value: nivel.idNivel,
  //     }));
  //   });
  // }

  // onNivelChange(event: Event) {
  //   const selectedNivel = Number((event.target as HTMLSelectElement).value);
  //   this.recursoService
  //     .getAsignaturasPorNivel(selectedNivel)
  //     .subscribe((res: any) => {
  //       console.log(res.data);
  //       this.asignaturas = res.data.map((asignatura: any) => ({
  //         label: asignatura.nombre,
  //         value: asignatura.idAsignatura,
  //       }));
  //     });
  // }

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
      nombreRecurso: [''],
      asignaturas: [''],
      nivelesType: [''],
    });
  }

  ngOnInit() {
    this.builderForm();
    this.loadNiveles();
    this.resourceForm.valueChanges.subscribe({
      next: (res:any) => {
        this.search.emit(res);
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

  onNivelChange(event: Event) {
    const selectedNivel = Number((event.target as HTMLSelectElement).value);
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
