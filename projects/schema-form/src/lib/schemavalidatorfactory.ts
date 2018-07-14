import { ValidationErrors } from '@angular/forms';

import {
  Schema,
  SchemaErrors,
  SchemaValidatorFn
} from './schema';

export abstract class SchemaValidatorFactory {
  abstract createValidatorFn(schema: Schema): SchemaValidatorFn;

  abstract getSchema(schema, ref): Schema;
}


