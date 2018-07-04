import { EventEmitter } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

import { Schema, SchemaValidatorFn } from '../schema';
import { FormPropertyErrors } from './form-property-errors';

export interface FormProperty extends AbstractControl {
  isRoot: boolean;
  id: string;
  path: string;
  schema: Schema;
  visible: boolean;
  visibilityChanges: BehaviorSubject<boolean>;
  nonEmptyValue: any;
  nonEmptyValueChanges: EventEmitter<any>;

  getErrors(): FormPropertyErrors | null;
  setPath(path: string);
  setSchema(schema: Schema);
  setSchemaValidator(fn: SchemaValidatorFn);
  setVisible(visible: boolean);
  bindVisibility();
}


