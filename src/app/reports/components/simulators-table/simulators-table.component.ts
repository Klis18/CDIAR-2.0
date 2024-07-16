import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { utils, writeFile } from 'xlsx'; // Importa las funciones utils y writeFile
import { ReportsService } from '../../services/reports.service';
import { SimulatorsReportsComponent } from '../../pages/simulators-reports/simulators-reports.component';
import { HomeService } from '../../../home/services/home.service';
import autoTable, { HAlignType } from 'jspdf-autotable';
import jsPDF from 'jspdf';
import {
  SimuladoresData,
  SimuladoresGetQuery,
} from '../../interfaces/simulator.interface';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'simulators-table',
  templateUrl: './simulators-table.component.html',
})
export class SimulatorsTableComponent implements OnInit {
  @Input() loadTable: boolean = false;
  @Input() searchData: any;
  @Output() loadedTableEmiter = new EventEmitter<boolean>();

  dataSimuladores: any = [];
  itemsPerPage: number = 5;
  totalPages: number = 1;

  public paginateCurrent: number[] = [];
  public pages!: number;
  public limit!: number;
  private idAsignatura!: number;
  private idNivel!: number;
  private id!: number;
  public simulatorForm!: FormGroup;
  public page!: number;
  limitsOptions = [
    {
      label: '5 Elementos',
      value: 5,
    },
    {
      label: '10 Elementos',
      value: 10,
    },
    {
      label: '15 Elementos',
      value: 15,
    },
  ];

  constructor(
    private reportService: ReportsService,
    private reportSimulador: SimulatorsReportsComponent,
    @Inject(FormBuilder) private formBuilder: FormBuilder,
    @Inject(HomeService) private homeService: HomeService
  ) {}

  ngOnInit(): void {
    this.listaDatosSimuladores();
  }

  generarPdf() {
    const doc = new jsPDF();

    const img = new Image();

    img.src = 'assets/CDIARLogo.png';

    const logoWidth = 30;
    const logoHeight = 25;

    doc.setFontSize(16);
    doc.text('CDIAR', 105, 20, { align: 'center' }); // Ajusta la posición (eje y) si es necesario
    doc.setFontSize(12);
    doc.text('Reporte de Usuarios', 105, 30, { align: 'center' }); // Ajusta la posición (eje y) si es necesario

    const headers = [
      [
        {
          content: 'Nombre Simulador',
          styles: { halign: 'center' as HAlignType },
        },
        {
          content: 'Nombres Completos',
          styles: { halign: 'center' as HAlignType },
        },
        { content: 'Asignatura', styles: { halign: 'center' as HAlignType } },
        { content: 'Nivel', styles: { halign: 'center' as HAlignType } },
        { content: 'Calificacion', styles: { halign: 'center' as HAlignType } },
        {
          content: 'Fecha Simulador Realizado',
          styles: { halign: 'center' as HAlignType },
        },
      ],
    ];

    const data = this.dataSimuladores.map((simulador: any) => [
      simulador.nombreSimulador,
      simulador.nombreEstudiante,
      simulador.asignatura,
      simulador.nivel,
      simulador.calificacion,
      new Date(simulador.fechaSimuladorRealizado).toLocaleDateString(),
    ]);

    autoTable(doc, {
      head: headers,
      body: data,
      startY: 40,
      styles: { halign: 'center' as HAlignType },
      theme: 'striped',
      didDrawPage: (data) => {
        doc.addImage(
          img,
          'PNG',
          10,
          10, // Posición vertical (arriba)
          logoWidth,
          logoHeight
        );
      },
    });

    doc.save('reporte_simuladores.pdf');
  }

  generarExcel() {
    const worksheet = utils.json_to_sheet(this.dataSimuladores);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Usuarios');
    writeFile(workbook, 'reporte_usuarios.xlsx');
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['searchData']) {
      this.idAsignatura = this.searchData?.asignaturas;
      this.idNivel = this.searchData?.nivelesType;
      //this.descripcion = this.searchData?.descripcion;
      this.listaDatosSimuladores();
    }
    if (changes['loadTable']) {
      if (this.loadTable) {
        this.listaDatosSimuladores();
      }
    }
  }

  pagination = {
    buttonLeft: true,
    buttonRight: true,
  };
  
  builderForm() {
    this.simulatorForm = this.formBuilder.group({
      limit: [5],
      page: [1],
    });
    this.limit = this.simulatorForm.get('limit')?.value;
    this.page = this.simulatorForm.get('page')?.value;
  }

  changePage(newPage: number) {
    if (newPage !== this.page) {
      console.log('PASO');
      this.page = newPage;
      this.listaDatosSimuladores();
    }
  }


  listaDatosSimuladores() {
    const paginate: SimuladoresGetQuery = {
      pages: this.pages,
      limit: this.limit,
      idAsignatura: this.idAsignatura,
      idNivel: this.idNivel,
      id: this.id,
    };
    this.reportService.getDataSimuladores(paginate).subscribe({
      next: (res: any) => {
        this.dataSimuladores = res.data;

        if (this.dataSimuladores.length === 0 || this.dataSimuladores) {
          this.paginateCurrent = [1];
        }
      },
      complete: () => {
        this.loadedTableEmiter.emit(true);
      },
    });
  }

  crearArreglo(limite: number, cant: number) {
    const rest = cant / limite;
    const elementos = Math.floor(rest);
    const arreglo = [];
    const more = rest - elementos;
    for (let i = 1; i <= elementos; i++) {
      arreglo.push(i);

      if (more > 0 && elementos === i) {
        arreglo.push(i + 1);
      }
      this.pagination.buttonLeft = true;
      this.pagination.buttonRight = true;
    }

    if (elementos > 0) {
      if (arreglo?.length === this.page) {
        this.pagination.buttonRight = false;
      }
      if (1 === this.page) {
        this.pagination.buttonLeft = false;
      }
    }

    if (elementos === 0) {
      this.pagination.buttonLeft = false;
      this.pagination.buttonRight = false;
      arreglo.push(1);
    }
    return arreglo;
  }
  prevPage() {
    if (this.pagination.buttonLeft) {
      const leftButton = this.simulatorForm.get('page')?.value;
      this.simulatorForm.get('page')?.setValue(leftButton - 1);
    }
  }

  nextPage() {
    if (this.pagination.buttonRight) {
      const rightButton = this.simulatorForm.get('page')?.value;
      this.simulatorForm.get('page')?.setValue(rightButton + 1);
    }
  }

  
}
