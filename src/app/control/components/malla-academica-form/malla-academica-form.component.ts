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
  mallaGroupForm!: FormGroup;
  response: any;

  private subscriptions: Subscription[] = [];

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
        this.valueFormEmitter.emit(this.mallaGroupForm.valid);
      })
    );
  }

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


  setData(data: any) {
    if (data && this.mallaGroupForm) {
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

loadNiveles() {
  this.sharedService.getNiveles().subscribe((res: any) => {
    this.nivelesType = res.data.map((nivel: Nivel) => ({
      label: nivel.descripcion,
      value: nivel.idNivel,
    }));
  });
}
}
