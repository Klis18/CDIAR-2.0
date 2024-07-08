import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Editor, Toolbar, Validators } from 'ngx-editor';
import { sendObservation, updateStatusMazo } from '../../../learn/interfaces/mazo.interface';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LearnService } from '../../../learn/services/learn.service';
import { EditorComponent } from '@tinymce/tinymce-angular';
import tinymce from 'tinymce';
import { RecursoService } from '../../../academic-resources/services/recurso.service';
import { approveResource, sendObservationResource } from '../../../academic-resources/interfaces/recurso.interface';


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
    private recursoService:RecursoService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ObservacionRechazoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.createForm();
    switch(this.opcion){
      case 'verObservacionMazo':
        // this.verObservacionMazo();
        break;
      case 'verObservacionRecurso':
        this.verObservacionRecurso();
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
      observacionArchivo: [''],
      observacion: ['',Validators.required], // Agrega el campo de observación para TinyMCE
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
    }
  }

  //----------RECURSOS ACADÉMICOS----------------
  rechazarRecurso(){
    if(this.observationForm.invalid){
      console.log('Formulario inválido');
    }
    const observacion: sendObservationResource = {
      idRecurso: this.data.id,
      observacion: this.observationForm.get('observacion')?.value,
      observacionesArchivo: this.observationForm.get('observacionArchivo')?.value,
    };
    console.log('Observacion a enviar', observacion);
    this.recursoService.sendObservation(observacion).subscribe((res) => {
      console.log('Observacion enviada', res);
      this.actualizarEstadoRecurso();
    });
    this.dialogRef.close();
  }

  actualizarEstadoRecurso() {
    const estado: approveResource = {
      idRecurso: this.data.id,
      idEstado: 3
    };
    this.recursoService.changeStatusResource(estado).subscribe((res) => {
      console.log('Recurso rechazado', res);
    });
  }

  //------------------FLASHCARDS----------------
  rechazarMazo() {
    const observacionMessage = this.observationForm.get('observacion')?.value;
    const observacion = {
      idMazo: this.data.id,
      observacion: observacionMessage.toString(),
    };

    this.learnService.enviarObservacion(observacion).subscribe((res) => {
      console.log('Observacion enviada', res);
      this.actualizarEstadoMazo();
    });
    this.dialogRef.close();
  }

  actualizarEstadoMazo() {
    const estado = {
      idMazo: this.data.id,
      idEstado: 3
    };
    this.learnService.publicarMazo(estado).subscribe((res) => {
      console.log('Mazo rechazado', res);
    });
  }

   onFileChange(event: any) {

    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const recursoFile = (reader.result as string).split(',')[1];
        console.log('recursoFile', recursoFile);
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

  verObservacionRecurso(){
    this.recursoService.getObservations(this.data.id).subscribe((res: any) => {
      console.log('Observaciones', res.data);
      this.observationForm.get('observacion')?.setValue(res.data.observacion);
      this.observationForm.get('observacion')?.disable();
      this.archivoObservacion = res.data.observacionesArchivo;
    });
  }


}
