import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { sendObservationMazo, updateStatusMazo } from '../../../learn/interfaces/mazo.interface';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LearnService } from '../../../learn/services/learn.service';
import { EditorComponent } from '@tinymce/tinymce-angular';
import tinymce from 'tinymce';
import { RecursoService } from '../../../academic-resources/services/recurso.service';
import { approveResource, sendObservationResource } from '../../../academic-resources/interfaces/recurso.interface';
import { SimulatorsService } from '../../../simulators/services/simulators.service';
import { Router } from '@angular/router';
import { VideolearnService } from '../../../learn/services/videolearn.service';
import { updateStatusVideolearn } from '../../../learn/interfaces/videolearn.interface';


@Component({
  selector: 'app-observacion-rechazo',
  templateUrl: './observacion-rechazo.component.html',
  styleUrl: './observacion-rechazo.component.css'
})
export class ObservacionRechazoComponent implements OnInit{

  @ViewChild('fileInput') fileInput!: ElementRef;

  observationForm!: FormGroup;
  listadoExtensionesImages = ['jpg', 'jpeg', 'png'];
  listadoExtensionesArchivos = [
    'docx',
    'pdf',
    'pptx',
    'xlsx',
    'txt',
    'doc',
    'ppt',
    'xls',
    'csv',
  ];
  opcion: string = this.data.opcion;
  myApiKey: string ='k6p16qwz4kk0yy3tkcuwd2qoj4wmsxslp5tzdhgqjjlhp2tz';
  onlyView: boolean = false;
  archivoObservacion: string = '';

  constructor(
    private learnService: LearnService,
    private videolearnService: VideolearnService,
    private recursoService:RecursoService,
    private simuladorService: SimulatorsService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ObservacionRechazoComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.createForm();
    switch(this.opcion){
      case 'verObservacionMazo':
        this.verObservacionMazo();
        this.onlyView = true;
        break;
      case 'verObservacionRecurso':
        this.verObservacionRecurso();
        this.onlyView = true;
        break;
      case 'verObservacionSimulador':
        this.verObservacionSimulador();
        this.onlyView = true;
        break;
      case 'verObservacionVideolearn':
        this.verObservacionVideoLearn();
        this.onlyView = true;
        break;
    }
  }

  init: EditorComponent['init'] = {
    plugins: 'lists link image table code help wordcount',
    menu: {
      file: { title: 'File', items: '' },
      edit: { title: 'Edit', items: 'undo redo | cut copy paste pastetext | selectall | searchreplace' },
      view: { title: 'View', items: 'code revisionhistory | visualaid visualchars visualblocks | spellchecker | preview fullscreen | showcomments' },
      insert: { title: 'Insert', items: '' },
      format: { title: 'Format', items: 'bold italic underline strikethrough superscript subscript codeformat | styles blocks fontfamily fontsize align lineheight | forecolor backcolor | language | removeformat' },
      tools: { title: 'Tools', items: 'spellchecker spellcheckerlanguage | a11ycheck code wordcount' },
      table: { title: 'Table', items: 'inserttable | cell row column | advtablesort | tableprops deletetable' },
      help: { title: 'Help', items: '' }
    },
    toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | help',
    placeholder: 'Escribe aquí tu observación...',
    language: 'es',
    tinycomments_mode: 'embedded',
    tinycomments_author: 'Author name'
  };

  createForm() {
    this.observationForm = this.fb.group({
      observacionArchivo: [],
      observacion: ['',Validators.required],
      observacionFileName: [''],
    });
  }


  enviarObservacionRechazo(){
    switch(this.opcion){
      case 'mazo':
        this.rechazarMazo();
        break;
      case 'recurso':
        this.rechazarRecurso();
        break;
      case 'simulador':
        this.rechazarSimulador();
        break;
      case 'videolearn':
        this.rechazarVideoLearn();
        break;
    }
  }

  //----------RECURSOS ACADÉMICOS----------------
  rechazarRecurso(){
    if(this.observationForm.invalid){
      return;
    }
    const observacion: sendObservationResource = {
      idRecurso: this.data.id,
      observacion: this.observationForm.get('observacion')?.value,
      observacionesArchivo: this.observationForm.get('observacionArchivo')?.value,
    };
    this.recursoService.sendObservation(observacion).subscribe((res) => {
      this.actualizarEstadoRecurso();
    });
    this.dialogRef.close();
    this.router.navigate(['/academic-resources']);    
  }

  actualizarEstadoRecurso() {
    const estado: approveResource = {
      idRecurso: this.data.id,
      idEstado: 3
    };
    this.recursoService.changeStatusResource(estado).subscribe((res) => {
    });
  }

  verObservacionRecurso(){
    this.recursoService.getObservations(this.data.id).subscribe((res: any) => {
      this.observationForm.get('observacion')?.setValue(res.data.observacion);
      this.observationForm.get('observacion')?.disable();
      this.archivoObservacion = res.data.observacionesArchivo;
    });
  }

  //------------------FLASHCARDS----------------
  rechazarMazo() {
    const observacionMazo: sendObservationMazo = {
      idMazo: this.data.id,
      observacion: this.observationForm.get('observacion')?.value,
      observacionesArchivo: this.observationForm.get('observacionArchivo')?.value,
    };

    this.learnService.enviarObservacion(observacionMazo).subscribe((res) => {
      this.actualizarEstadoMazo();
    });
    this.dialogRef.close();
    this.router.navigate(['/learn/flashcards']);

  }

  actualizarEstadoMazo() {
    const estado: updateStatusMazo ={
      idMazo: this.data.id,
      idEstado: 3
    };
    this.learnService.publicarMazo(estado).subscribe((res) => {
    });
  }

  verObservacionMazo(){
    this.learnService.getObservacion(this.data.id).subscribe((res: any) => {
      this.observationForm.get('observacion')?.setValue(res.data.observacion);
      this.observationForm.get('observacion')?.disable();
      this.archivoObservacion = res.data.observacionesArchivo;
    });
  }

  //-----------------VIDEOLEARNS----------------
  rechazarVideoLearn() {
    const observacion = {
      idVideoLearn: this.data.id,
      observacion: this.observationForm.get('observacion')?.value,
      observacionesArchivo: this.observationForm.get('observacionArchivo')?.value,
    };

    this.videolearnService.sendObservationVideolearn(observacion).subscribe((res:any) => {
      this.actualizarEstadoVideoLearn();
    });
    this.dialogRef.close();
    this.router.navigate(['/learn/videolearns']);
  }

  actualizarEstadoVideoLearn() {
    const estado: updateStatusVideolearn ={
      idVideoLearn: this.data.id,
      idEstado: 3
    };
    this.videolearnService.changeStatusVideolearn(estado).subscribe((res) => {
    });
  }
  verObservacionVideoLearn(){
    this.videolearnService.viewObservation(this.data.id).subscribe((res: any) => {
      this.observationForm.get('observacion')?.setValue(res.data.observacion);
      this.observationForm.get('observacion')?.disable();
      this.archivoObservacion = res.data.observacionesArchivo;
    });
  }


  //--------------SIMULADORES-----------------
  rechazarSimulador() {
    const observacion = {
      idSimulador: this.data.id,
      observacion:  this.observationForm.get('observacion')?.value,
      observacionesArchivo: this.observationForm.get('observacionArchivo')?.value,
    };

    this.simuladorService.sendObservationSimulator(observacion).subscribe((res:any) => {
      this.actualizarEstadoSimulador();
    });
    this.dialogRef.close();
    this.router.navigate(['/simuladores/repositorio-simuladores']);

  }

actualizarEstadoSimulador() {
    const estado = {
      idSimulador: this.data.id,
      idEstado: 3
    };
    this.simuladorService.actualizarEstadoSimulator(estado).subscribe((res:any) => {
    });
  }

  verObservacionSimulador(){
    this.simuladorService.getObservationSimulator(this.data.id).subscribe((res: any) => {
      this.observationForm.get('observacion')?.setValue(res.data.observacion);
      this.observationForm.get('observacion')?.disable();
      this.archivoObservacion = res.data.observacionesArchivo;
    });
  }

  //-------------------ARCHIVOS----------------

   onFileChange(event: any) {

    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const recursoFile = (reader.result as string).split(',')[1];
        if (recursoFile)
          this.observationForm.get('observacionArchivo')?.setValue(recursoFile);
          this.observationForm.get('observacionFileName')?.setValue(file.name);
      };
    }
  }

  selectFile(): void {
    this.fileInput.nativeElement.click();
  }

  cancelar() {
    this.dialogRef.close();
  }

}
