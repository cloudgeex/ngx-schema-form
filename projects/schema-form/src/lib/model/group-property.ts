import { FormProperty } from './form-property';

export interface GroupProperty extends FormProperty {
  forEach(fn: (property: FormProperty) => void, opts: { includeSelf: boolean });
  markAllAsTouched();
}
