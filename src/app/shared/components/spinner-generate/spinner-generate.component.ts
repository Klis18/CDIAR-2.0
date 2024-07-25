import { Component, Input } from '@angular/core';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'spinner-generate',
  templateUrl: './spinner-generate.component.html',
  styles: `
.modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color:rgba(7, 36, 131, 0.67);
  z-index: 1050; 
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
