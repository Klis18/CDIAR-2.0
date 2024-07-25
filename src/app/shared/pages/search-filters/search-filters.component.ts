import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { Nivel } from '../../interfaces/nivel.interface';
import { SharedService } from '../../services/shared.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'search-filters',
  templateUrl: './search-filters.component.html',
  styles: ``
})
export class SearchFiltersComponent {

  nivelesType: { label: string; value: string }[] = [];
  asignaturas: { label: string; value: string }[] = [];
  descripcion: string = '';
  filterForm!: FormGroup;
  @Output() search = new EventEmitter();

  constructor(
    private sharedService: SharedService,
    @Inject(FormBuilder) private formBuilder: FormBuilder
  ) {}

  builderForm() {
    this.filterForm = this.formBuilder.group({
      descripcion: [null],
      asignaturas: [null],
      nivelesType: [null],
    });
  }
  counter = 0;
  ngOnInit() {
    this.builderForm();
    this.loadNiveles();
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
    this.filterForm.get('nivelesType')?.valueChanges.subscribe({
      next: (level) => {
        if (level) {
          this.onNivelChange(level);
        }
      },
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

  onNivelChange(selectedNivel: number) {
    this.sharedService
      .getAsignaturasPorNivel(selectedNivel)
      .subscribe((res: any) => {
        this.asignaturas = res.data.map((asignatura: any) => ({
          label: asignatura.nombre,
          value: asignatura.idAsignatura,
        }));
      });
  }

}
