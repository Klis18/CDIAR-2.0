import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CargaHorariaComponent } from './pages/carga-horaria/carga-horaria.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableCargaDocenteComponent } from './components/table-carga-docente/table-carga-docente.component';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [CargaHorariaComponent, TableCargaDocenteComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule],
  exports: [CargaHorariaComponent],
})
export class DocenteModule {}
