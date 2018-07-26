import { Component } from '@angular/core';

import { StringWidget } from '../../base/string.widget';

@Component({
  selector: 'sf-string-widget',
  template: `<input *ngIf="getInputType() === 'hidden'; else notHiddenFieldBlock"
  [attr.name]="formProperty.name" type="hidden" [formControl]="formProperty">
  <ng-template #notHiddenFieldBlock>
    <div class="widget form-group">
      <label [attr.for]="id" class="horizontal control-label">
        {{ schema.title }}
      </label>
      <span *ngIf="schema.description" class="formHelp">{{schema.description}}</span>
      <input [name]="formProperty.name" [attr.readonly]="(id!=='color') && schema.readOnly?true:null"
      class="text-{{ id }} textline-widget form-control" [attr.type]="getInputType()"
      [attr.id]="id"  [formControl]="formProperty" [attr.placeholder]="schema.placeholder"
      [attr.maxLength]="schema.maxLength || null"
      [attr.minLength]="schema.minLength || null"
      [attr.disabled]="(id=='color' && schema.readOnly)?true:null">
      <input *ngIf="(id==='color' && schema.readOnly)" [attr.name]="formProperty.name" type="hidden" [formControl]="formProperty">
      <span class="help-block" *ngFor="let message of errorMessages">{{ message }}</span>

    </div>
  </ng-template>
  `
})
export class StringComponent extends StringWidget {

}
