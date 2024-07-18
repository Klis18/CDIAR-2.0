import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-question-form',
  templateUrl: './question-form.component.html',
  styles: ``
})
export class QuestionFormComponent {
  @Input() currentTime!: number;
  @Output() addQuestion = new EventEmitter<{ question: string, options: string[], correctAnswer: number }>();

  question: string = '';
  options: string[] = ['', '', '', ''];
  correctAnswer: number = 0;

  submitQuestion() {
    if (this.question && this.options.every(opt => opt)) {
      this.addQuestion.emit({ question: this.question, options: this.options, correctAnswer: this.correctAnswer });
    }
  }

  cancel() {
    // this.addQuestion.emit(null);
  }
}
