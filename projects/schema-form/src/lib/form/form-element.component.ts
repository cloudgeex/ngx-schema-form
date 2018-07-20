import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  InjectionToken
} from '@angular/core';
import { FormControl } from '@angular/forms';

import { Widget } from '../widget';
import { ActionRegistry } from '../model/actionregistry';
import { FormProperty } from '../model/form-property';

export abstract class FormElementTemplateRef extends TemplateRef<any> { }

@Component({
  selector: 'sf-form-element',
  template: `<div *ngIf="formProperty.visible && formProperty.schema.widget?.id !== 'none'"
    [class.has-error]="!formProperty.hasOwnProperty('controls') && !formProperty.valid"
	  [class.has-success]="!formProperty.hasOwnProperty('controls') && formProperty.valid">
	<ng-template sfWidgetChooser [formProperty]="formProperty"> </ng-template>
  <sf-form-element-action
    *ngFor="let button of buttons"
    [button]="button"
    [formProperty]="formProperty">
  </sf-form-element-action>
</div>`
})
export class FormElementComponent implements OnInit {


  @Input()
  formProperty: FormProperty;

  buttons = [];

  constructor(private actionRegistry: ActionRegistry) {}

  ngOnInit() {
    this.parseButtons();
  }

  private parseButtons() {
    if (this.formProperty.schema.buttons !== undefined) {
      this.buttons = this.formProperty.schema.buttons;

      for (const button of this.buttons) {
        this.createButtonCallback(button);
      }
    }
  }

  private createButtonCallback(button) {
    button.action = (e) => {
      let action;
      if (button.id && (action = this.actionRegistry.get(button.id))) {
        if (action) {
          action(this.formProperty, button.parameters);
        }
      }
      e.preventDefault();
    };
  }

}