import { Component } from "@angular/core";

import { ButtonLayoutWidget } from '../../widget';

@Component({
  selector: 'sf-button-widget',
  template: '<button (click)="action($event)">{{label}}</button>'
})
export class ButtonWidget extends ButtonLayoutWidget {
}
