import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
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
export class SimulatorsTableComponent implements OnInit, OnChanges {
 
  @Input() searchData: any;
  @Input() loadTable: boolean = false;
  @Output() loadedTableEmitter = new EventEmitter<boolean>();
  dataSimuladores: SimuladoresData[] = [];
  itemsPerPage: number = 5;
  totalPages: number = 1;
  nombreSimulador: string = '';
  nivel: string = '';
  asignatura: string = '';
  id: number = 0;
  private idAsignatura!: number;
  private idNivel!: number;
  private descripcion!: string;
  public page!: number;
  public limit: number = 5;
  public paginateCurrent: number[] = [];
  usuario: string = '';
  simulatorForm!: FormGroup;
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
    private reportsService: ReportsService,
    @Inject(FormBuilder) private formBuilder: FormBuilder,
  ) {}
  public userRol!: string;
  private idEstado!: number;
  
  pagination = {
    buttonLeft: false,
    buttonRight: false,
  };

  ngOnInit(): void {
    this.builderForm();

    this.simulatorForm.valueChanges.subscribe({
      next: (res) => {
        if (res?.limit) {
          this.limit = Number(res?.limit);
        }
        if (res?.page) {
          this.page = Number(res?.page);
        }
        this.listaDatosSimuladores();
      },
    });
    this.listaDatosSimuladores();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['searchData']) {
      this.idAsignatura = this.searchData?.asignaturas;
      this.idNivel = this.searchData?.nivelesType;
      this.nombreSimulador = this.searchData?.descripcion;
      this.listaDatosSimuladores();
    }
    if (changes['loadTable']) {
      if (this.loadTable) {
        this.listaDatosSimuladores();
      }
    }
  }

  builderForm() {
    this.simulatorForm = this.formBuilder.group({
      limit: [5],
      page: [1],
    });
    this.limit = this.simulatorForm.get('limit')?.value;
    this.page = this.simulatorForm.get('page')?.value;
  }

  goToPage(event: Event) {
    const target = event.target as HTMLInputElement;
    let page = parseInt(target.value, 10);
    if (!isNaN(page) && page >= 1 && page <= this.paginateCurrent.length) {
      this.page = page;
      this.listaDatosSimuladores();
    } else {
      target.value = this.page.toString();
      this.listaDatosSimuladores();
    }
  }
 
 
  listaDatosSimuladores() {
    const paginate: SimuladoresGetQuery = {
      page: this.page,
      limit: this.limit,
      idAsignatura: this.idAsignatura,
      idNivel: this.idNivel,
      nombreSimulador: this.nombreSimulador,
      id: this.id,
    };
    
    this.reportsService.getDataSimuladores(paginate).subscribe({
      next: (res: any) => {
        this.dataSimuladores = res.data ?? [];
        if (this.dataSimuladores.length > 0) {
          this.nombreSimulador = res.data.nombreSimulador;
          this.nivel = res.data.nivel;
          this.asignatura = res.data.asignatura;
          this.idNivel = res.data.idNivel;
          this.idAsignatura = res.data.idAsignatura;
          this.paginateCurrent = this.crearArreglo(this.limit, res.numRecord);
        }
        if (this.dataSimuladores?.length === 0 || !this.dataSimuladores) {
          this.paginateCurrent = [1];
        }
      },
      complete: () => {
        this.loadedTableEmitter.emit(false);
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
      this.listaDatosSimuladores();
    }
  }

  nextPage() {
    if (this.pagination.buttonRight) {
      const rightButton = this.simulatorForm.get('page')?.value;
      this.simulatorForm.get('page')?.setValue(rightButton + 1);
      this.listaDatosSimuladores();
    }
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
    doc.text('Reporte de Simuladores', 105, 30, { align: 'center' }); // Ajusta la posición (eje y) si es necesario

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
    utils.book_append_sheet(workbook, worksheet, 'Simuladores');
    writeFile(workbook, 'reporte_simuladores.xlsx');
  }
  
}
  
