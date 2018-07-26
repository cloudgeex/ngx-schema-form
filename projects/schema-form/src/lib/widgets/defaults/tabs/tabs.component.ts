import { Component } from '@angular/core';

import { FieldsetWidget } from '../../base/fieldset.widget';
import { Widget } from '../../../widget';

export interface Tab {
  title: string;
  fields: string[];
}

export interface Tabs extends Widget {
  tabs: Tab[];
}

@Component({
  selector: 'sf-form-tabs',
  template: `
    <div class="panel panel-default">
      <div class="panel-body" style="min-height: 420px;">
        <ul class="nav nav-tabs" style="margin-bottom: 10px">
          <li *ngFor="let tab of widget.tabs; let index=index"
            (click)="selectedTab = index"
            [class.active]="selectedTab === index"
            style="cursor: pointer">
            <a>{{ tab.title }}</a>
          </li>
        </ul>

        <div *ngFor="let tab of widget.tabs; let index=index" >
          <ng-container *ngIf="selectedTab === index">
            <div *ngFor="let field of tab.fields">
              <sf-form-field [formProperty]="formProperty.get(field)"> </sf-form-field>
            </div>
          </ng-container>
        </div>
      </div>
    </div>
  `
})
export class TabsComponent extends FieldsetWidget<Tabs> {
  selectedTab = 0;
}
