import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  private questions: any[] = [];

  getQuestions() {
    return this.questions;
  }

  addQuestion(question: any) {
    this.questions.push(question);
  }
}
