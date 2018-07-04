import { GenericProperty } from './generic-property';

export class BooleanProperty extends GenericProperty {

  setValue(value: any, options: {
    onlySelf?: boolean;
    emitEvent?: boolean;
    emitModelToViewChange?: boolean;
    emitViewToModelChange?: boolean;
  } = {}): void {
    if (typeof value !== 'boolean') {
      value = Boolean(value);
    }
    super.setValue(value, options);
  }
}


