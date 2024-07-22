import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { FooterComponent } from './pages/footer/footer.component';
import { CardMessageComponent } from './pages/card-message/card-message.component';
import { MaterialModule } from '../material/material.module';
import { SidebarComponent } from './pages/sidebar/sidebar.component';
import { CardConfirmComponent } from './pages/card-confirm/card-confirm.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from './components/input.components';
import { SelectComponent } from './components/select.components';
import { SearchFiltersComponent } from './pages/search-filters/search-filters.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { QuestionFilterComponent } from './pages/question-filter/question-filter.component';
import { ObservacionRechazoComponent } from './pages/observacion-rechazo/observacion-rechazo.component';
// import { NgxEditorComponent, NgxEditorModule } from 'ngx-editor';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { SpinnerGenerateComponent } from './components/spinner-generate/spinner-generate.component';
import { SignatureFiltersComponent } from './pages/signature-filters/signature-filters.component';


@NgModule({
  declarations: [
    FooterComponent,
    CardMessageComponent,
    SidebarComponent,
    CardConfirmComponent,
    InputComponent,
    SelectComponent,
    SearchFiltersComponent,
    QuestionFilterComponent,
    ObservacionRechazoComponent,
    SpinnerGenerateComponent,
    SignatureFiltersComponent,
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    NgSelectModule,
    // NgxEditorModule,
    EditorModule
  ],
  exports: [
    FooterComponent,
    SidebarComponent,
    InputComponent,
    SelectComponent,
    SearchFiltersComponent,
    QuestionFilterComponent,
    SpinnerGenerateComponent,
    SignatureFiltersComponent,
  ]
})
export class SharedModule { }
