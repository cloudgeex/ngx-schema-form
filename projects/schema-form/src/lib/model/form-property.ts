import { EventEmitter } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

import { Schema, SchemaValidatorFn } from '../schema';
import { FormPropertyErrors } from './form-property-errors';

export interface FormProperty extends AbstractControl {
  readonly isRoot: boolean;
  readonly id: string;
  readonly path: string;
  readonly schema: Schema;

  readonly visible: boolean;
  visibilityChanges: BehaviorSubject<boolean>;

  readonly nonEmptyValue: any;
  nonEmptyValueChanges: EventEmitter<any>;

  getErrors(): FormPropertyErrors | null;
  setVisible(visible: boolean);
  bindVisibility();
}
