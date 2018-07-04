import { ValidationErrors } from '@angular/forms';
import * as ZSchema from 'z-schema';

import {
  Schema,
  SchemaErrors,
  SchemaValidatorFn
} from './schema';

export abstract class SchemaValidatorFactory {
  abstract createValidatorFn(schema: Schema): SchemaValidatorFn;

  abstract getSchema(schema, ref): Schema;
}

export class ZSchemaValidatorFactory extends SchemaValidatorFactory {

  protected zschema;

  constructor() {
    super();
    this.zschema = new ZSchema({
        breakOnFirstError: false
    });
  }

  createValidatorFn(schema: Schema): SchemaValidatorFn {
    return (value: any): SchemaErrors | null => {

      if (schema.type === 'number' || schema.type === 'integer') {
        value = +value;
      }

      this.zschema.validate(value, schema);
      const errors = this.zschema.getLastErrors();
      if (!errors) {
        return null;
      }

      this.denormalizeRequiredPropertyPaths(errors);

      const schemaErrors = errors.reduce((_errors, error) => {
        error.path = error.path.slice(1);
        _errors[error.path] = error;
        return _errors;
      }, {});

      return schemaErrors || null;
    };
  }

  getSchema(schema: any, ref: string) {
    // check definitions are valid
    const isValid = this.zschema.compileSchema(schema);
    if (isValid) {
      return this.getDefinition(schema, ref);
    } else {
      throw this.zschema.getLastError();
    }
  }

  private denormalizeRequiredPropertyPaths(err: any[]) {
    if (err && err.length) {
      err = err.map(error => {
        const code = 'OBJECT_MISSING_REQUIRED_PROPERTY';
        if (error.path === '#/' && error.code === code) {
          error.path = `${error.path}${error.params[0]}`;
        }
        return error;
      });
    }
  }

  private getDefinition(schema: any, ref: string) {
    let foundSchema = schema;
    ref.split('/').slice(1).forEach(ptr => {
      if (ptr) {
        foundSchema = foundSchema[ptr];
      }
    });
    return foundSchema;
  }
}

