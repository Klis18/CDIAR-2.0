import { Component, OnInit } from '@angular/core';
import { usersData } from '../../interfaces/users.interface';
import { ReportsService } from '../../services/reports.service';
import { jsPDF } from 'jspdf';
import autoTable, { HAlignType } from 'jspdf-autotable';
import XLSX from 'xlsx';
import { utils, writeFile } from 'xlsx'; // Importa las funciones utils y writeFile

@Component({
  selector: 'user-table',
  templateUrl: './user-table.component.html',
  styles: ``,
})
export class UserTableComponent implements OnInit {
  dataUsuarios: any = [];

  constructor(private reportsService: ReportsService) {}

  ngOnInit() {
    this.listarDataUsuaerios();
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

  listarDataUsuaerios() {
    this.reportsService.getDataUsuarios().subscribe((res) => {
      this.dataUsuarios = res.data;
    });
  }
}
