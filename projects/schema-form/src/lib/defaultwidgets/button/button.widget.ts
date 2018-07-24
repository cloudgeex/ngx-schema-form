import { Component } from "@angular/core";

import { ButtonWidget as BaseButtonWidget } from '../../widget';

@Component({
  selector: 'sf-button-widget',
  template: '<button (click)="action($event)">{{label}}</button>'
})
export class ButtonWidget extends BaseButtonWidget {
}
