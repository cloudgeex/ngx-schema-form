import { Component, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { ControlWidget } from '../../../widget';

@Component({
  selector: 'sf-file-widget',
  template: `<div class="widget form-group">
	<label [attr.for]="id" class="horizontal control-label">
		{{ schema.title }}
	</label>
    <span *ngIf="schema.description" class="formHelp">{{schema.description}}</span>
  <input [name]="name" class="text-widget file-widget" [attr.id]="id"
    type="file" [attr.disabled]="schema.readOnly?true:null"
    (change)="onFileChange($event)">
	<input *ngIf="schema.readOnly" [attr.name]="name" type="hidden" [formControl]="fileName">
</div>`
})
export class FileComponent extends ControlWidget implements AfterViewInit {

  protected reader = new FileReader();
  protected filedata: any = {};
  fileName = new FormControl();

  constructor() {
    super();
  }

  ngAfterViewInit() {
    this.reader.onloadend = () => {
      this.filedata.data = btoa(this.reader.result);
      this.formProperty.setValue(this.filedata);
    };
  }

  onFileChange($event) {
    const file = $event.target.files[0];
    this.filedata.filename = file.name;
    this.filedata.size = file.size;
    this.filedata['content-type'] = file.type;
    this.filedata.encoding = 'base64';
    this.reader.readAsBinaryString(file);
  }
}
