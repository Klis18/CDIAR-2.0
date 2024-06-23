import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'question-filter',
  templateUrl: './question-filter.component.html',
  styles: ``
})
export class QuestionFilterComponent {
  descripcion: string = '';
  filterForm!: FormGroup;
  @Output() search = new EventEmitter();

  constructor(
    @Inject(FormBuilder) private formBuilder: FormBuilder
  ) {}

  builderForm() {
    this.filterForm = this.formBuilder.group({
      question: [null],
    });
  }
  counter = 0;

  ngOnInit() {
    this.builderForm();
  
    this.filterForm.valueChanges.subscribe({
      next: (res) => {
        this.counter++;
        setTimeout(() => {
          this.counter--;
          if (this.counter === 0) {
            this.search.emit(res);
          }
        }, 500);
      },
    });
    
  }
}
