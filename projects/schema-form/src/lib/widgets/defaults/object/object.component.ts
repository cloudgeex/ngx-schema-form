import { Component } from '@angular/core';

import { ObjectWidget } from '../../base/object.widget';


@Component({
  selector: 'sf-form-object',
  template: `
    <ng-template #formElement let-formProperty="formProperty">
      <sf-form-element [formProperty]="formProperty"></sf-form-element>
    </ng-template>

    <ng-container *ngFor="let fieldset of formProperty.schema.fieldsets">
      <ng-template
        sfFormFieldsetWidgetChooser
        [formProperty]="formProperty"
        [fieldset]="fieldset"
        [templateRef]="formElement">
      </ng-template>
    </ng-container>
  `
})
export class ObjectComponent extends ObjectWidget { }
