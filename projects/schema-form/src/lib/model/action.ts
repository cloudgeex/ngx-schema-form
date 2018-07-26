import { FormProperty } from './form-property';

export interface ActionEvent<T = any> {
  event: T;
  formProperty: FormProperty;
}

export type Action<T = any, U = any> = (event: ActionEvent<T>, params?: U) => void;
