import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  InjectionToken,
  Renderer2
} from '@angular/core';
import { FormControl } from '@angular/forms';

import { ActionRegistry } from '../model/actionregistry';
import { FormProperty } from '../model/form-property';

export abstract class FormElementTemplateRef extends TemplateRef<any> { }

// TODO move has-error/success classes to fieldset
@Component({
  selector: 'sf-form-element',
  template: `<div *ngIf="formProperty.visible && formProperty.schema.widget?.id !== 'none'"
    [class.has-error]="!formProperty.hasOwnProperty('controls') && !formProperty.valid"
	  [class.has-success]="!formProperty.hasOwnProperty('controls') && formProperty.valid">
	<ng-template sfFormPropertyWidgetChooser [formProperty]="formProperty"> </ng-template>
  <ng-template sfFormButtonWidgetChooser
    *ngFor="let button of buttons"
    [button]="button"
    [formProperty]="formProperty">
  </ng-template>
</div>`
})
export class FormElementComponent implements OnInit {


  @Input()
  formProperty: FormProperty;

  buttons = [];

  constructor(
    private actionRegistry: ActionRegistry,
  ) {}

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

  // TODO add type to button attribute
  private createButtonCallback(button) {
    const register = this.actionRegistry.get(button.id);
    if (!register) {
      return;
    }

    if (register.field) {
      button.field = register.field;
    }

    button.action = (event) => {

      if (register.action) {
        register.action(event, this.formProperty, button.parameters);
      }

      if (event.hasOwnProperty('preventDefault')) {
        event.preventDefault();
      }
    };
  }

}
