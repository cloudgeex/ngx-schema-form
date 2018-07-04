import { ValidationErrors } from '@angular/forms';

export interface Schema {
  [key: string]: any;
}

export interface SchemaErrors {
  [path: string]: {
    code: string;
    message: string;
    params?: any;
  };
}


export type SchemaValidatorFn = (value: any) => SchemaErrors | null;

export enum SchemaPropertyType {
  String = 'string',
  Object = 'object',
  Array = 'array',
  Boolean = 'boolean',
  Integer = 'integer',
  Number = 'number'
}




