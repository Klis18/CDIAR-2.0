import { Component, Input } from '@angular/core';
import { Form, FormControl } from '@angular/forms';

@Component({
  selector: 'app-select',
  template: `
    <select [formControl]="control">
      <option *ngFor="let option of options" [value]="option.value">{{option.label}}</option>
    </select>
  `,
})
export class SelectComponent {
    @Input() control!: FormControl;
    @Input() options!: any[];
  }