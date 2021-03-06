import { Component } from '@angular/core';

import { RadioWidget } from '../../base/radio.widget';

@Component({
  selector: 'sf-radio-widget',
  template: `<div class="widget form-group">
	<label>{{schema.title}}</label>
    <span *ngIf="schema.description" class="formHelp">{{schema.description}}</span>
	<div *ngFor="let option of schema.oneOf" class="radio">
		<label class="horizontal control-label">
			<input [formControl]="formProperty" value="{{option.enum[0]}}" type="radio"  [attr.disabled]="schema.readOnly">
			{{option.description}}
		</label>
	</div>
	<input *ngIf="schema.readOnly" type="hidden" [formControl]="formProperty">
</div>`
})
export class RadioComponent extends RadioWidget {}
