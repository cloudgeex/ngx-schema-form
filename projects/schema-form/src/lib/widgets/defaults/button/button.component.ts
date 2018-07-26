import { Component } from "@angular/core";

import { Widget, ButtonLayoutWidget } from '../../../widget';

export interface BaseButtonWidget extends Widget {
  onInvalidProperty: {
    disable: boolean,
    preventClick: boolean,
    markFormAsSubmitted: boolean
  };
}

export abstract class ButtonWidget extends ButtonLayoutWidget<BaseButtonWidget> {
  widget: BaseButtonWidget = {
    id: 'button',
    onInvalidProperty: {
      disable: false, // TODO implement support for default button widget
      preventClick: false,
      markFormAsSubmitted: false
    }
  };
}



@Component({
  selector: 'sf-button-component',
  template: '<button (click)="action($event)">{{label}}</button>'
})
export class ButtonComponent extends  ButtonWidget {
}
