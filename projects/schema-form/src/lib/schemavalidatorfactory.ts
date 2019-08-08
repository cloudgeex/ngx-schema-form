import { Schema, SchemaValidatorFn } from './schema';
import * as ZSchema from 'z-schema';

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

  createValidatorFn(schema: Schema) {
    return (value) => {

      if (schema.type === 'number' || schema.type === 'integer') {
        value = +value;
      }

      this.zschema.validate(value, schema);
      const err = this.zschema.getLastErrors();

      this.denormalizeRequiredPropertyPaths(err);

      return err || null;
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
        if (error.path === '#/' && error.code === 'OBJECT_MISSING_REQUIRED_PROPERTY') {
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

