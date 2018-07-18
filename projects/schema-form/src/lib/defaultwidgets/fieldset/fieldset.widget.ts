import { Component } from '@angular/core';

import { FieldsetLayoutWidget } from '../../widget';

@Component({
  selector: 'sf-form-fieldset',
  template: `
  <fieldset>
    <legend *ngIf="title">{{ title }}</legend>
    <div *ngIf="description">{{ description }}</div>
    <div *ngFor="let formProperty of formProperties">
      <sf-form-field [formProperty]="formProperty"> </sf-form-field>
    </div>
  </fieldset>
  `
})
export class FieldsetWidget extends FieldsetLayoutWidget { }
