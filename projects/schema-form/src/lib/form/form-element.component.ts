import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  InjectionToken,
  Renderer2
} from '@angular/core';
import { FormControl } from '@angular/forms';

import { FormProperty } from '../model/form-property';

export abstract class FormElementTemplateRef extends TemplateRef<any> { }

// TODO move has-error/success classes to fieldset
@Component({
  selector: 'sf-form-element',
  template: `<div *ngIf="formProperty.visible && formProperty.schema.widget?.id !== 'none'"
    [class.has-error]="!formProperty.hasOwnProperty('controls') && !formProperty.valid"
	  [class.has-success]="!formProperty.hasOwnProperty('controls') && formProperty.valid">
	<ng-template sfFormPropertyWidgetChooser [formProperty]="formProperty"> </ng-template>
  <ng-container *ngIf="formProperty.schema.buttons as buttons">
    <ng-template sfFormButtonWidgetChooser
      *ngFor="let button of buttons"
      [button]="button"
      [formProperty]="formProperty">
    </ng-template>
  </ng-container>
</div>`
})
export class FormElementComponent {

  @Input()
  formProperty: FormProperty;

}
