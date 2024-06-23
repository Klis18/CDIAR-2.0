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
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    NgSelectModule
  ],
  exports: [
    FooterComponent,
    SidebarComponent,
    InputComponent,
    SelectComponent,
    SearchFiltersComponent,
    QuestionFilterComponent,
  ]
})
export class SharedModule { }
