import { FormControl } from '@angular/forms';

import { ControlProperty } from './control-property';
import { Schema } from '../schema';

export class GenericProperty extends ControlProperty(FormControl) {

  constructor(path: string, schema: Schema) {
    super(schema.default);
    this._path = path;
    this._schema = schema;
  }

  _updateValue() {
    if (this.value === null || this.value === '') {
      this.nonEmptyValue = undefined;
      return;
    }

    this.nonEmptyValue = this.value;
  }
}
