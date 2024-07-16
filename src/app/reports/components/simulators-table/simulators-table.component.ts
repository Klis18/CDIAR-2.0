import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
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

  constructor(
    private reportService: ReportsService,
    private reportSimulador: SimulatorsReportsComponent,
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
}
