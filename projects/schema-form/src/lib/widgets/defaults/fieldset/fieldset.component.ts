import { Component } from '@angular/core';

import { FieldsetWidget } from '../../base/fieldset.widget';

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
export class FieldsetComponent extends FieldsetWidget { }
