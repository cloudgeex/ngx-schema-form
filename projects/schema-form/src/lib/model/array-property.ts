import { FormArray, ValidationErrors } from '@angular/forms';

import { Schema } from '../schema';
import { FormProperty } from './form-property';
import { FormPropertyErrors } from './form-property-errors';
import { FormPropertyFactory } from './form-property-factory';
import { ControlProperty } from './control-property';


export class ArrayProperty extends ControlProperty(FormArray) {

  constructor(
    private formPropertyFactory: FormPropertyFactory,
    path: string,
    schema: Schema
  ) {
    super([]);
    this._path = path;
    this._schema = schema;
  }

  _updateValue() {
    // to avoid ts complaints
    super['_updateValue']();

    this.nonEmptyValue = this.controls
      .filter((control: FormProperty) => {
        const enabled = control.enabled || this.disabled;
        return control.nonEmptyValue !== undefined && enabled;
      })
      .map((control) => control.value);
  }

  getErrors(): FormPropertyErrors | null {

    const aggregatedErrors = this.controls
      .reduce((errors, property: FormProperty) => {

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

  patchValue(
    value: any[],
    options: {onlySelf?: boolean, emitEvent?: boolean} = {}
  ) {
    value.forEach((newValue: any, index: number) => {

      this.addPropertyAt(index);

      if (this.at(index)) {
        this.at(index).patchValue(
          newValue,
          { onlySelf: true, emitEvent: options.emitEvent }
        );
      }
    });
    this.updateValueAndValidity(options);
  }

  addProperty() {
    const property = this.getPropertyFromSchemaItems();
    super.push(property);
    property.bindVisibility();
  }

  addPropertyAt(index: number) {
    const property = this.getPropertyFromSchemaItems();
    this.insert(index, property);
    property.bindVisibility();
  }

  bindVisibility() {
    super.bindVisibility();

    this.controls.forEach((control: FormProperty) => {
      control.bindVisibility();
    });
  }

  private getPropertyFromSchemaItems(): FormProperty {
    return this.formPropertyFactory.createProperty(
      this.schema.items,
      this
    );
  }

}


