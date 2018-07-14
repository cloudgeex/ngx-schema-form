import { FormGroup, ValidationErrors } from '@angular/forms';

import { Schema } from '../schema';
import { FormProperty } from './form-property';
import { FormPropertyErrors } from './form-property-errors';
import { FormPropertyFactory } from './form-property-factory';
import { ControlProperty } from './control-property';

export class ObjectProperty extends ControlProperty(FormGroup) {

  constructor(path: string, schema: Schema) {
    super({});
    this._path = path;
    this._schema = schema;
  }

  _updateValue() {
    // to avoid ts complaints
    super['_updateValue']();
    this.nonEmptyValue = this['_reduceChildren'](
      {},
      (
        result: {[key: string]: FormProperty},
        control: FormProperty,
        name: string
      ) => {
        if (control.nonEmptyValue === undefined) {
          return result;
        }
        if (control.enabled || this.disabled) {
          result[name] = control.nonEmptyValue;
        }
        return result;
      }
    );

  }

  getErrors(): FormPropertyErrors | null {

    const aggregatedErrors = Object.keys(this.controls)
      .reduce((errors, key: string) => {
        const property = <FormProperty>this.controls[key];

        const propertyErrors = property.getErrors();
        if (!propertyErrors) {
          return errors;
        }

        return Object.assign(errors, propertyErrors.errors);
      }, {});

    if (this.errors) {
      aggregatedErrors[this.path] = this.errors;
    }

    if (!Object.keys(aggregatedErrors).length) {
      return null;
    }

    return new FormPropertyErrors(aggregatedErrors);
  }

  bindVisibility() {
    super.bindVisibility();

    for (const key in this.controls) {
      if (this.schema.properties.hasOwnProperty(key)) {
        (<FormProperty>this.controls[key]).bindVisibility();
      }
    }
  }
}


