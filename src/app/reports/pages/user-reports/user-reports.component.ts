import { Component } from '@angular/core';

@Component({
  selector: 'app-user-reports',
  templateUrl: './user-reports.component.html',
  styles: ``,
})
export class UserReportsComponent {
  generatePDF() {
    console.log('Button was clicked');
  }
}
