import { FormControl } from '@angular/forms';


import { FormProperty } from './form-property'; // needed because of mixin
import { ControlProperty } from './control-property';
import { Schema } from '../schema';

export class GenericProperty extends ControlProperty(FormControl) {

  constructor(path: string, schema: Schema) {
    super(schema.default);
    this.path = path;
    this.schema = schema;
  }

  _updateValue() {
    if (this.value === null || this.value === '') {
      this.nonEmptyValue = undefined;
      return;
    }

    this.nonEmptyValue = this.value;
  }
}
