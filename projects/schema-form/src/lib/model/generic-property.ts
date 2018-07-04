import { FormControl } from '@angular/forms';

import { ControlProperty } from './control-property';

export class GenericProperty extends ControlProperty(FormControl) {

  _updateValue() {
    if (this.value === null || this.value === '') {
      this.nonEmptyValue = undefined;
      return;
    }

    this.nonEmptyValue = this.value;
  }
}
