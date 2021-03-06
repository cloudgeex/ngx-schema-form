import { Component } from '@angular/core';

import { RangeWidget } from '../../base/range.widget';

@Component({
  selector: 'sf-range-widget',
  template: `<div class="widget form-group">
	<label [attr.for]="id" class="horizontal control-label">
		{{ schema.title }}
	</label>
    <span *ngIf="schema.description" class="formHelp">{{schema.description}}</span>	
  <input
    [name]="formProperty.name" class="text-widget range-widget"
    [attr.id]="id"
    [formControl]="formProperty"
    [attr.type]="'range'"
    [attr.min]="schema.minimum"
    [attr.max]="schema.maximum"
    [attr.disabled]="schema.readOnly?true:null" >
	<input *ngIf="schema.readOnly" [attr.name]="formProperty.name" type="hidden">
</div>`
})
export class RangeComponent extends RangeWidget {}
