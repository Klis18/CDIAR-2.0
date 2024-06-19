import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ListMazo, typeTable } from '../../interfaces/mazo.interface';
import { LearnService } from '../../services/learn.service';
import { MatDialog } from '@angular/material/dialog';
import { DetailsMazoComponent } from '../details-mazo/details-mazo.component';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { AsignarRevisorComponent } from '../../../control/pages/asignar-revisor/asignar-revisor.component';
import { HomeService } from '../../../home/services/home.service';

interface DataItem {
  title: string;
  content: string;
}

@Component({
  selector: 'cards-flashcards',
  templateUrl: './cards-flashcards.component.html',
  styles: ``
})
export class CardsFlashcardsComponent implements OnInit, OnChanges{
  @Input() filterByUser: string = '';
  @Input() filterByStatus: string = '';
  @Input() filterByRevisor: string = '';
  @Input() typeTable!: typeTable;
  @Input() searchData: any;
  @Input() loadTable: boolean = false;
  @Output() loadedTableEmitter = new EventEmitter<boolean>();

  private idAsignatura!: number;
  private idNivel!: number;
  private descripcion!: string;
  
  data: ListMazo[] =[];
  colors = ['#67E8A2', '#67E8DA', '#C883F1', '#CB48A0', '#7FCDE8', '#E4E87F', '#E8BB7F']; // Puedes cambiar estos colores

  //constructor(private http: HttpClient) {}
  constructor(private learnService:LearnService,
              private dialog: MatDialog,
              private router: Router,
              @Inject(AsignarRevisorComponent) private approve: AsignarRevisorComponent,
              @Inject(HomeService) private homeService: HomeService,
              @Inject(FormBuilder) private formBuilder: FormBuilder,
  ) {}

  ngOnInit() {
    this.listaMazos();
    
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['searchData']) {
      this.idAsignatura = this.searchData?.asignaturas;
      this.idNivel = this.searchData?.nivelesType;
      console.log({ searchData: this.searchData });
      this.descripcion = this.searchData?.descripcion;
      this.listaMazos();
    }
    if (changes['loadTable']) {
      if (this.loadTable) {
        this.listaMazos();
      }
    }
  }

  actualizarNombreMazo(nombreMazo: string) {
    this.learnService.cambiarNombreMazo(nombreMazo);
    this.router.navigate(['/learn/preguntas']);
  }


  listaMazos(){
    this.learnService.getMazos().subscribe((res:any) => {
      this.data = res.data;
      console.log(this.data);
    });
  }

  getGradient(index: number) {
    const color1 = this.colors[index % this.colors.length];
    const color2 = this.colors[(index + 1) % this.colors.length];
    return `linear-gradient(to right, ${color1} 0%, ${color2} 100%)`;
  }

  viewDetailsMazo(idMazo: number) {
    
    this.dialog.open(DetailsMazoComponent, {
      width: '30%',
      data: {id: idMazo},
    });
  }

  redirigirPreguntas(item: ListMazo) {
    this.router.navigate(['/learn/preguntas',{id: item.idMazo, mazo: item.nombreMazo}]);
  }

  redirigirEstudiarFlashcards(item: ListMazo) {
    this.router.navigate(['/learn/estudiar-flashcards',{id: item.idMazo, mazo: item.nombreMazo}]);
  }
}
