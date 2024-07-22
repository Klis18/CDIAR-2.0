import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, Subscription } from 'rxjs';
import { SecurityService } from '../../services/security.service';
import { HomeService } from '../../../home/services/home.service';
import { Nivel } from '../../../shared/interfaces/nivel.interface';
import { SharedService } from '../../../shared/services/shared.service';
import { Validators } from 'ngx-editor';

@Component({
  selector: 'malla-academica-form',
  templateUrl: './malla-academica-form.component.html',
  styles: ``
})
export class MallaAcademicaFormComponent {
  @Input() formData!: any;
  @Input() tipo!: string;
  @Input() id!: number;
  @Output() editedDataEmitter = new EventEmitter<any>();
  @Output() valueFormEmitter = new EventEmitter<boolean>();
  @Input() onlyView!: boolean;


  nivelesType: { label: string; value: string }[] = [];
  tipoRegistro: { label: string; value: string }[] = [];
//   asignaturas: { label: string; value: string }[] = [];
  mallaGroupForm!: FormGroup;
  response: any;
//   rol: string = '';
//   nivel: string = '';
//   asignatura: string = '';
//   nombreSimulador: string = '';

  private subscriptions: Subscription[] = [];


//   // selectedOption: string = '';

  constructor(
    private fb: FormBuilder,
    private securityService: SecurityService,
    private sharedService: SharedService,
    private homeService: HomeService
  ) {}

  ngOnInit() {
    this.createForm();
    this.loadNiveles();
    this.tipoRegistro = [
      { label: 'Nivel', value: '1' },
      { label: 'Asignatura', value: '2' },
    ];

    if (this.formData) {
      console.log('Data desde preguntas simulador', this.formData);
      this.setData(this.formData);
      if(this.onlyView == false){
        this.mallaGroupForm.disable();
      }
    }

      this.subscriptions.push(
      this.mallaGroupForm.valueChanges.pipe(
        debounceTime(300)
      ).subscribe(() => { 
        if(this.mallaGroupForm.get('tipoRegistro')?.value === '1'){
          this.response = {
            tipoRegistro: this.mallaGroupForm.get('tipoRegistro')?.value,
            descripcion: this.mallaGroupForm.get('descripcion')?.value,  
          };
        }
        if(this.mallaGroupForm.get('tipoRegistro')?.value === '2'){
          this.response = {
            tipoRegistro: this.mallaGroupForm.get('tipoRegistro')?.value,
            nombre: this.mallaGroupForm.get('descripcion')?.value,
            idNivel: this.mallaGroupForm.get('idNivel')?.value,
          };
        }
        this.editedDataEmitter.emit(this.response);
        console.log('Data desde malla academica', this.response);
        this.valueFormEmitter.emit(this.mallaGroupForm.valid);
      })
    );

  }

//   ngOnInit() {
//     this.createForm();
//     // this.loadTiposPreguntas();
//     this.obtenerDatosSimulador(this.id);
//     this.homeService.obtenerDatosMenu().subscribe({
//       next: (user) => {
//         if (user) this.rol = user.data?.rol;
//        // this.ngSuscribesOnInit();

//         if (this.formData) {
//           console.log('Data desde preguntas simulador', this.formData);
//           this.setData(this.formData);
//           if(this.onlyView == false){
//             this.simulatorQuestionGroupForm.disable();
//           }
//         }
//       },
//       error: () => {
//         window.alert('No cargo la información del Usuario Administrador');
//       },
//     });

//     this.subscriptions.push(
//       this.simulatorQuestionGroupForm.valueChanges.pipe(
//         debounceTime(300)  // Ejemplo de debounce para reducir peticiones
//       ).subscribe(() => {
//         
//       const response = {
//         idSimulador: this.id,
//         pregunta: this.simulatorQuestionGroupForm.get('pregunta')?.value,
//         idTipoPregunta: this.questionType,
//         opcionesRespuestas: this.opcionesRespuestas,
//       };
      

//       this.editedDataEmitter.emit(response);
//       this.valueFormEmitter.emit(this.simulatorQuestionGroupForm.valid);

//       })
//     );
//   }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['formData']) {
      this.setData(changes['formData'].currentValue);
    }
  }

  createForm() {
    this.mallaGroupForm = this.fb.group({
      tipoRegistro: [''],
      descripcion: ['', Validators.required],
      idNivel: [''],
    });
  }

//   obtenerDatosSimulador(idSimulador: number ){
//     this.simulatorService.getDatosSimulator(idSimulador).subscribe((res)=>{
//       this.nivel = res.data.nivel;
//       this.asignatura = res.data.asignatura;
//     });
//   }

// idPregunta:number = 0;

  setData(data: any) {
    if (data && this.mallaGroupForm) {
      // this.mallaGroupForm.patchValue({
      //   pregunta: data.pregunta,
      //   idTipoPregunta: data.idTipoPregunta,
      // });
      if(this.tipo === '1'){
        this.mallaGroupForm.patchValue({
          tipoRegistro: this.tipo,
          descripcion: data.descripcion,
        });
      }else if(this.tipo === '2'){
        this.mallaGroupForm.patchValue({
          tipoRegistro: this.tipo,
          idNivel: data.idNivel,
          descripcion: data.nombre,
        });
      }
    }
  }

   
//   }

  
//   tipoPreguntaSeleccionada: any;
//   questionType: number = 0;


//   onChange(option:any) {
//     this.tipoPreguntaSeleccionada = option;
//     this.questionType = option.value;
//   }
  
//   clickControllers(){
//     document.getElementById('radio1')?.addEventListener('click', () => {
//       this.radioSeleccionado1 = true;
//       this.radioSeleccionado2 = false;
//       this.radioSeleccionado3 = false;
//       this.radioSeleccionado4 = false;
//     });
//     document.getElementById('radio2')?.addEventListener('click', () => {
//       this.radioSeleccionado2 = true;
//       this.radioSeleccionado1 = false;
//       this.radioSeleccionado3 = false;
//       this.radioSeleccionado4 = false;
//     });
//     document.getElementById('radio3')?.addEventListener('click', () => {
//       this.radioSeleccionado3 = true;
//       this.radioSeleccionado1 = false;
//       this.radioSeleccionado2 = false;
//       this.radioSeleccionado4 = false;
//     });
//     document.getElementById('radio4')?.addEventListener('click', () => {
//       this.radioSeleccionado4 = true;
//       this.radioSeleccionado1 = false;
//       this.radioSeleccionado2 = false;
//       this.radioSeleccionado3 = false;
//     });
    
//     document.getElementById('checkbox1')?.addEventListener('click', () => {
//       this.checkboxSeleccionado1 = !this.checkboxSeleccionado1;
//     });
//     document.getElementById('checkbox2')?.addEventListener('click', () => {
//       this.checkboxSeleccionado2 = !this.checkboxSeleccionado2;
//     });
//     document.getElementById('checkbox3')?.addEventListener('click', () => {
//       this.checkboxSeleccionado3 = !this.checkboxSeleccionado3;
//     });
//     document.getElementById('checkbox4')?.addEventListener('click', () => {
//       this.checkboxSeleccionado4 = !this.checkboxSeleccionado4;
//     });
//   }

loadNiveles() {
  this.sharedService.getNiveles().subscribe((res: any) => {
    this.nivelesType = res.data.map((nivel: Nivel) => ({
      label: nivel.descripcion,
      value: nivel.idNivel,
    }));
  });
}
}
