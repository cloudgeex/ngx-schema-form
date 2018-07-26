import { Action } from '../../model/action';
import { ButtonLayoutWidget, Widget } from './widget';

export class ButtonWidgetOptions {
  onInvalidFormProperty = {
    disable: false,
    preventClick: false
  };
}

export abstract class ButtonWidget<T extends Widget = Widget>
extends ButtonLayoutWidget<T> {
  options = new ButtonWidgetOptions();
}
