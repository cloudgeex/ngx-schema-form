import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  InjectionToken,
  Renderer2
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
  <ng-template sfFormElementAction
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
    const _button = this.actionRegistry.get(button.id);
    if (!_button) {
      return;
    }

    if (_button.field) {
      button.field = _button.field;
    }
    button.action = (event) => {
      if (_button.action) {
        _button.action(event, this.formProperty, button.parameters);
      }

      if (event.hasOwnProperty('preventDefault')) {
        event.preventDefault();
      }
    };
  }

}
