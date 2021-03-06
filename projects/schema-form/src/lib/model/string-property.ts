import { GenericProperty } from './generic-property';

export class StringProperty extends GenericProperty {

  setValue(value: any, options: {
    onlySelf?: boolean;
    emitEvent?: boolean;
    emitModelToViewChange?: boolean;
    emitViewToModelChange?: boolean;
  } = {}): void {
    if (typeof value !== 'string') {
      value = `${value}`;
    }
    // TODO remove this
    if (value === 'null') {
      value = ''
    }
    super.setValue(value, options);
  }
}
