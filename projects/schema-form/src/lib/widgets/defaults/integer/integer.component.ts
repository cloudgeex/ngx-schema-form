import {
  Component,
} from '@angular/core';

import { IntegerWidget } from '../../base/integer.widget';

@Component({
  selector: 'sf-integer-widget',
  template: `<div class="widget form-group">
	<label [attr.for]="id" class="horizontal control-label">
		{{ schema.title }}
	</label>
  <span *ngIf="schema.description" class="formHelp">{{schema.description}}</span>
	<input [attr.readonly]="schema.readOnly?true:null" [name]="formProperty.name"
	class="text-widget integer-widget form-control" [formControl]="formProperty"
	[attr.type]="'number'" [attr.min]="schema.minimum" [attr.max]="schema.maximum"
	[attr.placeholder]="schema.placeholder"
	[attr.maxLength]="schema.maxLength || null"
  [attr.minLength]="schema.minLength || null">
</div>`
})
export class IntegerComponent extends IntegerWidget {}
