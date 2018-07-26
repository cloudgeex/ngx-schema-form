import { Widget } from '../../widget';
import { Action } from '../../model/action';


export abstract class ButtonWidget extends Widget {

  label?: string;

  action?: Action;
  onInvalidProperty?: {
    disable?: false, // TODO implement support for default button widget
    preventClick?: false,
    markFormAsSubmitted?: false
  };
}
