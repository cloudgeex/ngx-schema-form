import { Component } from '@angular/core';

import { SelectWidget } from '../../base/select.widget';

@Component({
  selector: 'sf-select-widget',
  template: `<div class="widget form-group">
  <label [attr.for]="id" class="horizontal control-label">
    {{ schema.title }}
  </label>

  <span *ngIf="schema.description" class="formHelp">
    {{schema.description}}
  </span>

  <select
    *ngIf="schema.type!='array'"
    [formControl]="formProperty"
    [attr.disabled]="schema.readOnly"
    class="form-control">
    <option *ngFor="let option of schema.oneOf" [ngValue]="option.enum[0]" >
    {{option.description}}
    </option>
  </select>

  <select *ngIf="schema.type==='array'" multiple [formControl]="formProperty" [attr.disabled]="schema.readOnly" class="form-control">
    <option *ngFor="let option of schema.items.oneOf" [ngValue]="option.enum[0]" >{{option.description}}</option>
  </select>

  <input *ngIf="schema.readOnly" type="hidden" [formControl]="formProperty">
</div>`
})
export class SelectComponent extends SelectWidget {}
