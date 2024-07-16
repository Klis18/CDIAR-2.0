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
import { userDataGetQuery, usersData } from '../../interfaces/users.interface';
import { ReportsService } from '../../services/reports.service';
import { jsPDF } from 'jspdf';
import autoTable, { HAlignType } from 'jspdf-autotable';
import XLSX from 'xlsx';
import { utils, writeFile } from 'xlsx'; // Importa las funciones utils y writeFile
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'user-table',
  templateUrl: './user-table.component.html',
  styles: ``,
})
export class UserTableComponent implements OnInit, OnChanges {
  @Input() loadTable: boolean = false;
  @Output() loadedTableEmitter = new EventEmitter<boolean>();
  @Input() searchData: any;

  dataUsuarios: any = [];
  searchInfo: any;
  reloadTable: boolean = false;
  data: any[] = [];

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

  public page!: number;
  public limit: number = 5;
  public paginateCurrent: number[] = [];
  public nombresCompletos: string = '';
  itemsPerPage: number = 5;
  totalPages: number = 1;
  dataUserForm!: FormGroup;
  pagination = {
    buttonLeft: true,
    buttonRight: true,
  };

  constructor(
    private reportsService: ReportsService,
    @Inject(FormBuilder) private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.listaDataUsuarios();
    console.log(this.listaDataUsuarios());
  }

  emitSearch(res: any) {
    if (res) {
      this.searchInfo = res;
    }
  }

  // loadTable() {
  //   this.reloadTable = true;
  // }

  loadedTale() {
    this.reloadTable = false;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['searchData']) {
      this.nombresCompletos = this.searchData?.question;
      this.listaDataUsuarios();
    }
    if (changes['loadTable']) {
      if (this.loadTable) {
        this.listaDataUsuarios();
      }
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
    doc.text('Reporte de Usuarios', 105, 30, { align: 'center' }); // Ajusta la posición (eje y) si es necesario

    const headers = [
      [
        {
          content: 'Nombre Completos',
          styles: { halign: 'center' as HAlignType },
        },
        { content: 'Cédula', styles: { halign: 'center' as HAlignType } },
        { content: 'Correo', styles: { halign: 'center' as HAlignType } },
        { content: 'Celular', styles: { halign: 'center' as HAlignType } },
        { content: 'Rol', styles: { halign: 'center' as HAlignType } },
        {
          content: 'Fecha Registro',
          styles: { halign: 'center' as HAlignType },
        },
      ],
    ];

    const data = this.dataUsuarios.map((usuario: any) => [
      usuario.nombresCompletos,
      usuario.cedula,
      usuario.correo,
      usuario.telefono,
      usuario.rol,
      new Date(usuario.fechaRegistro).toLocaleDateString(),
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

    doc.save('reporte_usuarios.pdf');
  }

  generarExcel() {
    const worksheet = utils.json_to_sheet(this.dataUsuarios);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Usuarios');
    writeFile(workbook, 'reporte_usuarios.xlsx');
  }

  // listarDataUsuarios() {
  //   this.reportsService.getDataUsuarios().subscribe((res) => {
  //     this.dataUsuarios = res.data;
  //   });
  // }

  listaDataUsuarios() {
    const paginate: userDataGetQuery = {
      pages: this.page,
      limit: this.limit,
      nombresCompletos: this.nombresCompletos,
    };

    this.reportsService.getDataUsuarios(paginate).subscribe({
      next: (res: any) => {
        this.dataUsuarios = res.data ?? [];
        if (this.dataUsuarios.length > 0) {
          // this.idFlashcard = res.data.idFlashcard;
          // this.preguntaFlashcard = res.data.pregunta;
          this.paginateCurrent = this.crearArreglo(this.limit, res.numRecord);
        }
        if (this.dataUsuarios?.length === 0 || !this.dataUsuarios) {
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

  builderForm() {
    this.dataUserForm = this.formBuilder.group({
      limit: [5],
      page: [1],
    });
    this.limit = this.dataUserForm.get('limit')?.value;
    this.page = this.dataUserForm.get('page')?.value;
  }

  changePage(newPage: number) {
    if (newPage !== this.page) {
      console.log('PASO');
      this.page = newPage;
      this.listaDataUsuarios();
    }
  }

  prevPage() {
    if (this.pagination.buttonLeft) {
      const leftButton = this.dataUserForm.get('page')?.value;
      this.dataUserForm.get('page')?.setValue(leftButton - 1);
    }
  }

  nextPage() {
    if (this.pagination.buttonRight) {
      const rightButton = this.dataUserForm.get('page')?.value;
      this.dataUserForm.get('page')?.setValue(rightButton + 1);
    }
  }
}
