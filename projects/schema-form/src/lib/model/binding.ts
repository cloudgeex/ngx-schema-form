import {FormProperty} from './form-property';

export interface Binding {
  [eventName: string]: ((event: any, formProperty: FormProperty) => void) | ((event: any, formProperty: FormProperty) => void)[];
}
