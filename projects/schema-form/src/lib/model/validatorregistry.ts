import { ValidatorFn } from '@angular/forms';

export class ValidatorRegistry {
  private validators: { [path: string]: ValidatorFn | ValidatorFn[] } = {};

  register(path: string, validator: ValidatorFn | ValidatorFn[]) {
    this.validators[path] = validator;
  }

  get(path: string): ValidatorFn | ValidatorFn[] {
    return this.validators[path];
  }

  clear() {
    this.validators = { };
  }
}
