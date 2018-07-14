import { Component, OnInit, AfterViewInit } from '@angular/core';

import { ControlWidget } from '../../widget';

@Component({
  selector: 'sf-checkbox-widget',
  template: `<div class="widget form-group">
    <label [attr.for]="id" class="horizontal control-label">
        {{ schema.title }}
    </label>
  <div *ngIf="schema.type!='array'" class="checkbox">
    <label class="horizontal control-label">
      <input [formControl]="formProperty" [attr.name]="name" [indeterminate]="formProperty.value !== false && formProperty.value !== true ? true :null" type="checkbox" [attr.disabled]="schema.readOnly">
      <input *ngIf="schema.readOnly" [attr.name]="name" type="hidden" [formControl]="formProperty">
      {{schema.description}}
    </label>
  </div>
  <ng-container *ngIf="schema.type==='array'">
    <div *ngFor="let option of schema.items.oneOf" class="checkbox">
      <label class="horizontal control-label">
        <input [attr.name]="name"
          value="{{option.enum[0]}}" type="checkbox"
          [attr.disabled]="schema.readOnly"
          (change)="check($event.target.checked, $event.target.value)"
          [attr.checked]="checked[option.enum[0]] ? true : null">
        {{option.description}}
      </label>
    </div>
  </ng-container>
</div>`
})
export class CheckboxWidget extends ControlWidget implements OnInit {

  checked: any = {};

  ngOnInit() {
    if (this.schema.type === 'array') {
      this.formProperty.valueChanges.subscribe((values: any[]) => {

        values.forEach((value: any) => {
          if (!this.checked[value]) {
            this.checked[value] = true;
          }
        });

      });
    }
  }

  check(checked: boolean, value: any) {
    if (checked) {
      this.checked[value] = true;
    } else {
      delete this.checked[value];
    }

    this.formProperty.patchValue(
      Object.keys(this.checked).filter((key) => this.checked[key])
    );
  }
}
