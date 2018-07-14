import { ValidatorFn } from '@angular/forms';

export interface Field {
  name: string;
  required: boolean;
  getSchema(): any;
  getButtons(): any;
  getValidators(): { path: string, validators: ValidatorFn | ValidatorFn[] }[];
}


