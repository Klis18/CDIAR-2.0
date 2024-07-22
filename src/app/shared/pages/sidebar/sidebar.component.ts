import { Component, Input, OnInit, inject } from '@angular/core';
import { HomeService } from '../../../home/services/home.service';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styles: ``,
})
export class SidebarComponent implements OnInit {
  rol: string = '';

  constructor(private homeService: HomeService){}

  ngOnInit(): void {
    this.homeService.obtenerDatosMenu().subscribe((user) => {
      this.rol = user.data.rol;
      this.menuOptions = this.menuOptions.filter((option) =>
        option.roles.includes(this.rol)
      );
    });
  }

  menuOptions = [
    {
      icon: 'home',
      name: 'Inicio',
      route: '/home/landing',
      expanded: false,
      subOptions: [],
      roles: ['Docente', 'Admin', 'Estudiante'],
    },
    {
      icon: 'collections_bookmark',
      name: 'Recursos Académicos',
      route: '/academic-resources',
      expanded: false,
      subOptions: [],
      roles: ['Docente', 'Estudiante'],
    },
    {
      icon: 'spa',
      name: 'Aprender',
      route: '/learn',
      expanded: false,
      subOptions: [
        { name: 'Flashcards', route: '/learn/flashcards'},
        { name: 'Videolearn', route: '/learn/videolearns' },
      ],
      roles: ['Docente', 'Estudiante'],
    },
    {
      icon: 'assignment',
      name: 'Simuladores',
      route: '/simuladores/repositorio-simuladores',
      expanded: false,
      subOptions: [],
      roles: ['Docente', 'Estudiante'],
    },
    {
      icon: 'trending_up',
      name: 'Metas y Rendimiento',
      route: '/contacto',
      expanded: false,
      subOptions: [
        { name: 'Metas', route: '' },
        { name: 'Rendimiento', route: '' },
      ],
      roles: ['Estudiante'],
    },
    {
      icon: 'calendar_today',
      name: 'Carga Horaria',
      route: '/carga-horaria',
      expanded: false,
      subOptions: [],
      roles: ['Docente'],
    },
    {
      icon: 'security',
      name: 'Control y Seguridad',
      route: 'control-security',
      expanded: false,
      subOptions: [
        { name: 'Aprobación Docente', route: '/control-security/aprobar-docentes/' },
        { name: 'Malla Académica', route: '/control-security/malla-academica' },
        { name: 'Carga Horaria', route: '/control-security/carga-horaria/'},
        { name: 'Asignación Revisor', route: '/control-security/asignar-revisor/' },
      ],
      roles: ['Admin'],
    },
    {
      icon: 'insert_drive_file',
      name: 'Reportes',
      route: '/reports',
      expanded: false,
      subOptions: [
        { name: 'Reporte de Usuarios', route: '/reports/user-report' },
        { name: 'Reporte de Simuladores', route: '/reports/simulators-report' },
      ],
      roles: ['Admin'],
    },
    {
      icon: ' insert_chart',
      name: 'Dashboard',
      route: '/dashboard',
      expanded: false,
      subOptions: [],
      roles: ['Admin'],
    },
  ];

  toggleExpand(option: any) {
    option.expanded = !option.expanded;
  }
}
