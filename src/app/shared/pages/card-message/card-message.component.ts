import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpInterceptorService } from '../../services/http.interceptor.service';

@Component({
  selector: 'app-card-message',
  templateUrl: './card-message.component.html',
  styles: ``
})
export class CardMessageComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: HttpInterceptorService) {}

  imagen = this.data.status; 
}
