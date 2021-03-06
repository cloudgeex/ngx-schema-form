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
  name: string;

  visible: boolean;
  visibilityChanges: BehaviorSubject<boolean>;

  nonEmptyValue: any;
  nonEmptyValueChanges: EventEmitter<any>;

  widgetInstance: any;

  getErrors(): FormPropertyErrors | null;
  setVisible(visible: boolean);
  bindVisibility();
}
