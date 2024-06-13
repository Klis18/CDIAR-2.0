import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-carga-horaria',
  templateUrl: './carga-horaria.component.html',
  styles: ``
})
export class CargaHorariaComponent implements OnInit{
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
//   cargaHorariaForm: FormGroup;
//   diasSemana: { label: string; value: number }[] = [];
//   data: ListaCargaHoraria[] = [];
//   currentPage: number = 1;
//   itemsPerPage: number = 5;
//   totalPages: number = 1;
// usuario: string = '';

// private homeService = inject(HomeService);

//   constructor(private docenteService: DocenteService, private fb: FormBuilder) {
//     this.cargaHorariaForm = this.fb.group({
//       cargaHoraria: this.fb.array([]),
//     });
//   }

//   ngOnInit(): void {
//     this.loadDiasSemana();
//     this.listaCargaHoraria();
//     this.setData(this.data);
//     this.homeService.obtenerDatosMenu().subscribe((user) => {
//       console.log(user);
//       this.usuario = user.data.userName;
//     });
//   }

//   get cargaHorariaArray(): FormArray {
//     return this.cargaHorariaForm.get('cargaHoraria') as FormArray;
//   }

//   addCargaHoraria(): void {
//     const cargaHorariaGroup = this.fb.group({
//       diaSemana: ['', Validators.required],
//       actividad: ['', Validators.required],
//       horaDesde: ['', Validators.required],
//       horaHasta: ['', Validators.required],
//     });
//     this.cargaHorariaArray.push(cargaHorariaGroup);
//   }

//   removeCargaHoraria(index: number): void {
//     this.cargaHorariaArray.removeAt(index);
//   }

//   loadDiasSemana(): void {
//     this.docenteService.getDiasSemana().subscribe((res: any) => {
//       this.diasSemana = res.data.map((dia: any) => ({
//         label: dia.nombre,
//         value: dia.idDiaSemana,
//       }));
//     });
//   }

//   onSubmit(): void {
//     if (this.cargaHorariaForm.valid) {
//       const cargaHorariaList: CargaHoraria[] =
//         this.cargaHorariaForm.value.cargaHoraria;

//       const payload = {
//         cargaHoraria: cargaHorariaList,
//       };

//       this.docenteService.createCargaHoraria(payload).subscribe();
//     }
//   }

//   listaCargaHoraria() {
//     this.docenteService.listaCargaHoraria().subscribe((res: any) => {
//       console.log(res);
//       this.data = res.data;
  
      // Añade un control de formulario para cada elemento en data
  //     this.data.forEach((_, index) => this.addCargaHoraria());
  //   });
  // }

  // get paginatedData(): ListaCargaHoraria[] {
  //   const start = (this.currentPage - 1) * this.itemsPerPage;
  //   const end = start + this.itemsPerPage;

  //   const filteredData = this.data.filter(
  //     (item) =>
  //       item.nombreDocente === this.usuario
  //   );
  //   return filteredData.slice(start, end);
  // }

  // setData(data: any) {
  //   console.log(data);
  //   if (data && this.cargaHorariaForm) {
  //     this.cargaHorariaForm.patchValue({
  //       diaSemana: data.diaSemana,
  //       actividad: data.actividad,
  //       horaDesde: data.horaDesde,
  //       horaHasta: data.horaHasta,
  //     });
  //   }
  // }
}
