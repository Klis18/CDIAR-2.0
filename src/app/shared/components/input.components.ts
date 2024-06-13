import { Component, Input } from '@angular/core';
import { FormControl} from '@angular/forms';

@Component({
    selector: 'app-input',
    template: `
        <input [formControl]="control">
    `
})
export class InputComponent {
    @Input() control!: FormControl;
}