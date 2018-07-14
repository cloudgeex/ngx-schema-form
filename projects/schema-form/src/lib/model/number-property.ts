import { GenericProperty } from './generic-property';

export class NumberProperty extends GenericProperty {

  setValue(value: any, options: {
    onlySelf?: boolean;
    emitEvent?: boolean;
    emitModelToViewChange?: boolean;
    emitViewToModelChange?: boolean;
  } = {}): void {
    super.setValue(+value, options);
  }
}


