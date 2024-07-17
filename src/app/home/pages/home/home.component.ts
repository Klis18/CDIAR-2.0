import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  // styles: ``,
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  message = '';
  private fullMessage = 'Bienvenido a CDIAR, tu acompañante en el camino hacia el aprendizaje efectivo';

  constructor() {
    this.typeMessage();
  }

  typeMessage() {
    let i = 0;
    const interval = setInterval(() => {
      if (i < this.fullMessage.length) {
        this.message += this.fullMessage.charAt(i);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 100); // Puedes ajustar la velocidad de escritura cambiando este valor
  }

}
