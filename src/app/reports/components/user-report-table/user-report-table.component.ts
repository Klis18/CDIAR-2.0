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
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReportsService } from '../../services/reports.service';
import { userDataGetQuery } from '../../interfaces/users.interface';
import jsPDF from 'jspdf';
import autoTable, { HAlignType } from 'jspdf-autotable';
import { utils, writeFile } from 'xlsx';

@Component({
  selector: 'user-report-table',
  templateUrl: './user-report-table.component.html',
  styles: ``,
})
export class UserReportTableComponent implements OnInit, OnChanges {

  @Input() loadTable: boolean = false;
  @Output() loadedTableEmitter = new EventEmitter<boolean>();
  @Input() searchData: any;
  

  dataUsuarios: any;
  data: any;
  nombresCompletos = '';
  searchInfo: any;
  users!: FormGroup;
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

  public page!: number;
  public limit: number = 5;
  public paginateCurrent: number[] = [];

  constructor(private reportService: ReportsService,
              @Inject(FormBuilder) private formBuilder: FormBuilder    
  ){}


  ngOnInit(){
    this.builderForm();
    this.users.valueChanges.subscribe({
      next: (res) => {
        if (res?.limit) {
          this.limit = Number(res?.limit);
        }
        if (res?.page) {
          this.page = Number(res?.page);
        }
        this.listaUsuarios();
      },
    });
    this.listaUsuarios();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['searchData']) {
      this.nombresCompletos = this.searchData?.question;
      console.log('searchData', this.nombresCompletos);
      this.listaUsuarios();
    }
    if (changes['loadTable']) {
      if (this.loadTable) {
        this.listaUsuarios();
      }
    }
  }
  pagination = {
    buttonLeft: true,
    buttonRight: true,
  };

  builderForm() {
    this.users = this.formBuilder.group({
      limit: [5],
      page: [1],
    });
    this.limit = this.users.get('limit')?.value;
    this.page = this.users.get('page')?.value;
  }

  goToPage(event: Event) {
    const target = event.target as HTMLInputElement;
    let page = parseInt(target.value, 10);
    if (!isNaN(page) && page >= 1 && page <= this.paginateCurrent.length) {
      this.page = page;
      this.listaUsuarios();
    } else {
      target.value = this.page.toString();
      this.listaUsuarios();
    }
  }
 
 

  listaUsuarios() {
    const paginate: userDataGetQuery = {
      page: this.page,
      limit: this.limit,
      nombresCompletos: this.nombresCompletos,
    };
   console.log('Paginación', paginate);
    this.reportService.getDataUsuarios(paginate).subscribe({
      next: (res: any) => {
        this.data = res.data ?? [];
        if (this.data.length > 0) {
          this.nombresCompletos = res.data.nombresCompletos;
          this.paginateCurrent = this.crearArreglo(this.limit, res.numRecord);
        }
        if (this.data?.length === 0 || !this.data) {
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
      const leftButton = this.users.get('page')?.value;
      this.users.get('page')?.setValue(leftButton - 1);
    }
  }

  nextPage() {
    if (this.pagination.buttonRight) {
      const rightButton = this.users.get('page')?.value;
      this.users.get('page')?.setValue(rightButton + 1);
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
          content: 'Nombres Completos',
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

    const data = this.data.map((usuario: any) => [
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
          10, 
          logoWidth,
          logoHeight
        );
      },
    });

    doc.save('reporte_usuarios.pdf');
  }

  generarExcel() {
    const worksheet = utils.json_to_sheet(this.data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Usuarios');
    writeFile(workbook, 'reporte_usuarios.xlsx');
  }
}
