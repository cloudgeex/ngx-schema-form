import { Component } from '@angular/core';

import { FileWidget } from '../../base/file.widget';

@Component({
  selector: 'sf-file-widget',
  template: `<div class="widget form-group">
	<label [attr.for]="id" class="horizontal control-label">
		{{ schema.title }}
	</label>
    <span *ngIf="schema.description" class="formHelp">{{schema.description}}</span>
  <input [name]="formProperty.name" class="text-widget file-widget" [attr.id]="id"
    type="file" [attr.disabled]="schema.readOnly?true:null"
    (change)="onFileChange($event)">
	<input *ngIf="schema.readOnly" [attr.name]="formProperty.name" type="hidden" [formControl]="fileName">
</div>`
})
export class FileComponent extends FileWidget {

}
