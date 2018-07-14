import * as Ajv from 'ajv';

import { Schema, SchemaErrors, SchemaValidatorFn } from './schema';
import { SchemaValidatorFactory } from './schemavalidatorfactory';


export class AjvSchemaValidatorFactory extends SchemaValidatorFactory {

  protected ajv;

  constructor() {
    super();
    this.ajv = new Ajv({
      schemaId: 'auto',
      allErrors: true
    });
  }

  createValidatorFn(schema: Schema): SchemaValidatorFn {
    const validate = this.ajv.compile(schema);

    return (value: any): SchemaErrors | null => {

      const valid = validate(value);
      if (valid) {
        return null;
      }

      const schemaErrors = validate.errors.reduce((errors, error) => {

        let path: string;
        if (error.schemaPath === '#/required') {
          // denormalize required
          path = '/' + error.params.missingProperty;
        } else {
          path = error.dataPath.replace(/(\.|\[|\].)/g, '/');
        }
        errors[path] = {
          code: error.keyword,
          message: error.message
        };
        return errors;
      }, {});

      return schemaErrors || null;
    };
  }

  getSchema(schema: Schema, ref: string) {
    // throws if compilation fails
    this.ajv.compile(schema);

    return this.getDefinition(schema, ref);
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

