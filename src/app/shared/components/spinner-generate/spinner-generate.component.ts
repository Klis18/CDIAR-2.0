import { Component, Input } from '@angular/core';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'spinner-generate',
  templateUrl: './spinner-generate.component.html',
  styles: `
    /* spinner-modal.component.css */
.modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  // background-color: rgba(0, 0, 0, 0.5);
  // background-color: rgba(7, 36, 131, 0.27);
  background-color:rgba(7, 36, 131, 0.67);
  z-index: 1050; /* Valor alto para asegurar que esté sobre otros elementos */
}

.modal.show {
  display: flex;
  justify-content: center;
  align-items: center;
}
  `
})
export class SpinnerGenerateComponent {
  @Input() message: string = '';

  showSpinner: boolean = false;

  constructor(private spinnerService: SpinnerService) { }

  ngOnInit(): void {
    this.spinnerService.spinnerState.subscribe((state) => {
      this.showSpinner = state;
    });
  }
}
