import {
  Component,
  Input,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';

import { FormProperty } from '../model/form-property';
import { FormElementTemplateRef } from './form-element.component';


@Component({
  selector: 'sf-form-field',
  template: `
    <ng-container
      *ngTemplateOutlet="templateRef; context: { formProperty: formProperty }">
    </ng-container>
  `,
  encapsulation: ViewEncapsulation.None
})
export class FormFieldComponent {

  @Input()
  formProperty: FormProperty;

  templateRef: TemplateRef<any>;

  constructor(formElementTemplateRef: FormElementTemplateRef) {
    this.templateRef = formElementTemplateRef;
  }

}

