import { Component } from '@angular/core';

import { ButtonWidget } from '../../base/button.widget';


@Component({
  selector: 'sf-button-component',
  template: '<button (click)="action($event)">{{label}}</button>'
})
export class ButtonComponent extends  ButtonWidget {
}
