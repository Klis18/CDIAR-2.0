import { Component, Inject } from '@angular/core';
import { SimulatorsService } from '../../services/simulators.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UpdateSimulator } from '../../interfaces/simulators.interface';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { CardMessageComponent } from '../../../shared/pages/card-message/card-message.component';

@Component({
  selector: 'app-edit-simulator',
  templateUrl: './edit-simulator.component.html',
  styles: ``
})
export class EditSimulatorComponent {
  nivelesType: { label: string; value: string }[] = [];
  asignaturas: { label: string; value: string }[] = [];
  estados: { label: string; value: string }[] = [];
  datosSimulador!:any;
  editaDataMazo!: any;
  validForm:boolean = true;


  constructor(private simulatorService:SimulatorsService,
              private dialogRef: MatDialogRef<EditSimulatorComponent>,
              private spinnerService: SpinnerService,
              private dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  tituloForm: string = this.data.titulo;

  ngOnInit(){
    this.getSimulador(this.data.id);
  }
  
  getSimulador(idSimulador:number){
    this.simulatorService.getDatosSimulator(idSimulador).subscribe((res: any) => {
      this.datosSimulador = res.data;
    });
  }

    saveSimulador(){
      if(!this.validForm){
        return;
    }
    
    const simuladorEdit: UpdateSimulator = {
      idSimulador: this.data.id,
      idNivel: this.datosSimulador.idNivel,
      idAsignatura: this.datosSimulador.idAsignatura,
      nombreSimulador: this.datosSimulador.nombreSimulador,
    }
    this.spinnerService.showSpinner();
    
    this.simulatorService.updateSimulator(simuladorEdit)
    .subscribe((res) => {
      this.spinnerService.hideSpinner();

      this.CloseModal(res.statusCode.toString())
    },
    (error) => {
        this.spinnerService.hideSpinner();
        this.dialog.open(CardMessageComponent, {
          width: '80%',
          maxWidth: '500px',
          maxHeight: '80%',
          data: {status:'error', mensaje: 'Error al editar el simulador, por favor intente de nuevo.'},
        });
      });   
  }

  getData(events:any){
    this.datosSimulador = events;
  }

  CloseModal(mensaje?:string){
    this.dialogRef.close(mensaje);
  }

  getValidForm(event:any){
    this.validForm = event;
  }

  updateAsignatura(event: any) {
    this.asignaturas = event;
  }
   cancelar() {
    this.dialogRef.close();
  }
}
