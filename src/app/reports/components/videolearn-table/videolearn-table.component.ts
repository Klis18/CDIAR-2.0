import { Component, EventEmitter, Inject, Input, Output, SimpleChanges } from '@angular/core';
import { ReportsService } from '../../services/reports.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { VideoLearnsReport, videoLearnsReportGetQuery } from '../../interfaces/videolearn.interface';
import { utils, writeFile } from 'xlsx'; // Importa las funciones utils y writeFile
import autoTable, { HAlignType } from 'jspdf-autotable';
import jsPDF from 'jspdf';

@Component({
  selector: 'videolearn-table-report',
  templateUrl: './videolearn-table.component.html',
  styles: ``
})
export class VideolearnTableComponent {
  @Input() usuario!: string;
  @Input() searchData: any;
  @Input() loadTable: boolean = false;
  @Output() loadedTableEmitter = new EventEmitter<boolean>();
  dataVideoLearn: VideoLearnsReport[] = [];
  itemsPerPage: number = 5;
  totalPages: number = 1;
  nombreVideolearn: string = '';
  nivel: string = '';
  asignatura: string = '';
  id: number = 0;
  private idAsignatura!: number;
  private idNivel!: number;
  private descripcion!: string;
  public page!: number;
  public limit: number = 5;
  public paginateCurrent: number[] = [];
  videolearnForm!: FormGroup;
  limitsOptions = [
    {
      label: '5',
      value: 5,
    },
    {
      label: '10',
      value: 10,
    },
    {
      label: '15',
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

    this.videolearnForm.valueChanges.subscribe({
      next: (res) => {
        if (res?.limit) {
          this.limit = Number(res?.limit);
        }
        if (res?.page) {
          this.page = Number(res?.page);
        }
        this.listaDatosVideolearns();
      },
    });
    this.listaDatosVideolearns();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['searchData']) {
      this.idAsignatura = this.searchData?.asignaturas;
      this.idNivel = this.searchData?.nivelesType;
      this.nombreVideolearn = this.searchData?.descripcion;
      this.listaDatosVideolearns();
    }
    if (changes['loadTable']) {
      if (this.loadTable) {
        this.listaDatosVideolearns();
      }
    }
  }

  builderForm() {
    this.videolearnForm = this.formBuilder.group({
      limit: [5],
      page: [1],
    });
    this.limit = this.videolearnForm.get('limit')?.value;
    this.page = this.videolearnForm.get('page')?.value;
  }

  goToPage(event: Event) {
    const target = event.target as HTMLInputElement;
    let page = parseInt(target.value, 10);
    if (!isNaN(page) && page >= 1 && page <= this.paginateCurrent.length) {
      this.page = page;
      this.listaDatosVideolearns();
    } else {
      target.value = this.page.toString();
      this.listaDatosVideolearns();
    }
  }
 
 
  listaDatosVideolearns() {
    const paginate: videoLearnsReportGetQuery = {
      pages: this.page,
      limit: this.limit,
      idAsignatura: this.idAsignatura,
      idNivel: this.idNivel,
      nombreVideoLearn: this.nombreVideolearn,
      nombreEstudiante: this.usuario,
    };
    
    this.reportsService.getDataVideoLearns(paginate).subscribe({
      next: (res: any) => {
        this.dataVideoLearn = res.data ?? [];
        if (this.dataVideoLearn.length > 0) {
          this.nombreVideolearn = res.data.nombreVideoLearn;
          this.nivel = res.data.nivel;
          this.asignatura = res.data.asignatura;
          this.idNivel = res.data.idNivel;
          this.idAsignatura = res.data.idAsignatura;
          this.paginateCurrent = this.crearArreglo(this.limit, res.numRecord);
        }
        if (this.dataVideoLearn?.length === 0 || !this.dataVideoLearn) {
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
      const leftButton = this.videolearnForm.get('page')?.value;
      this.videolearnForm.get('page')?.setValue(leftButton - 1);
      this.listaDatosVideolearns();
    }
  }

  nextPage() {
    if (this.pagination.buttonRight) {
      const rightButton = this.videolearnForm.get('page')?.value;
      this.videolearnForm.get('page')?.setValue(rightButton + 1);
      this.listaDatosVideolearns();
    }
  }

  generarPdf() {
    const doc = new jsPDF();

    const img = new Image();

    img.src = 'assets/CDIARLogo.png';

    const logoWidth = 30;
    const logoHeight = 25;

    doc.setFontSize(16);
    doc.text('CDIAR', 105, 20, { align: 'center' }); 
    doc.setFontSize(12);
    doc.text('Reporte de VideoLearns', 105, 30, { align: 'center' }); 

    const headers = [
      [
        {
          content: 'Nombre VideoLearn',
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
          content: 'Fecha Videolearn Realizado',
          styles: { halign: 'center' as HAlignType },
        },
      ],
    ];

    const data = this.dataVideoLearn.map((videolearn: any) => [
      videolearn.nombreVideoLearn,
      videolearn.nombreEstudiante,
      videolearn.asignatura,
      videolearn.nivel,
      videolearn.calificacion,
      new Date(videolearn.fechaVideoLearnRealizado).toLocaleDateString(),
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
          10,
          logoWidth,
          logoHeight
        );
      },
    });

    doc.save('reporte_videolearns.pdf');
  }

  generarExcel() {
    const worksheet = utils.json_to_sheet(this.dataVideoLearn);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Videolearns');
    writeFile(workbook, 'reporte_videolearns.xlsx');
  }
}
