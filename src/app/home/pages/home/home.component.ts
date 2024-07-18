import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { Nivel } from '../../../shared/interfaces/nivel.interface';
import { SharedService } from '../../../shared/services/shared.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  // styles: ``,
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  counter = 0;
  message = '';
  message2 = '';
  public fullMessage = 'Bienvenido a CDIAR';
  public fullMessage2 = 'Tu acompañante en el camino hacia el aprendizaje efectivo';

  nivelesType: { label: string; value: string }[] = [];
  asignaturas: { label: string; value: string }[] = [];
  descripcion: string = '';
  filterForm!: FormGroup;
  @Output() search = new EventEmitter();

  constructor( private sharedService: SharedService,
    @Inject(FormBuilder) private formBuilder: FormBuilder) {
    this.typeMessage();
    setTimeout(() => {
      this.typeMessage2();
    }, 3000); // Puedes ajustar el tiempo de espera para que empiece a escribir el segundo mensaje cambiando este valor
  }

  typeMessage() {
    this.counter = 0;
    const interval = setInterval(() => {
      if (this.counter < this.fullMessage.length) {
        this.message += this.fullMessage.charAt(this.counter);
        this.counter++;
      } else {
        clearInterval(interval);
      }
    }, 100); // Puedes ajustar la velocidad de escritura cambiando este valor
  }

  typeMessage2() {
    this.counter = 0;
    this.message2 = '';
    const interval = setInterval(() => {
      if (this.counter < this.fullMessage2.length) {
        this.message2 += this.fullMessage2.charAt(this.counter);
        this.counter++;
      } else {
        clearInterval(interval);
      }
    }, 100); // Puedes ajustar la velocidad de escritura cambiando este valor
  }


  

  builderForm() {
    this.filterForm = this.formBuilder.group({
      descripcion: [null],
      asignaturas: [null],
      nivelesType: [null],
    });
  }
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
        console.log({ level });
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
        console.log(res.data);
        this.asignaturas = res.data.map((asignatura: any) => ({
          label: asignatura.nombre,
          value: asignatura.idAsignatura,
        }));
      });
  }


}
