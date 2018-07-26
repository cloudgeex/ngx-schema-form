import { Component } from '@angular/core';

import { ArrayWidget } from '../../base/array.widget';


@Component({
  selector: 'sf-array-widget',
  template: `<div class="widget form-group">
	<label [attr.for]="id" class="horizontal control-label">
		{{ schema.title }}
	</label>
	<span *ngIf="schema.description" class="formHelp">{{schema.description}}</span>
	<div *ngFor="let formProperty of formProperty.controls; let i=index">
		<sf-form-element [formProperty]="formProperty"></sf-form-element>
		<button (click)="removeItem(i)" class="btn btn-default array-remove-button">
			<span class="glyphicon glyphicon-minus" aria-hidden="true"></span> Remove
		</button>
	</div>
	<button (click)="addItem()" class="btn btn-default array-add-button">
		<span class="glyphicon glyphicon-plus" aria-hidden="true"></span> Add
	</button>
</div>`
})
export class ArrayComponent extends ArrayWidget {


}
