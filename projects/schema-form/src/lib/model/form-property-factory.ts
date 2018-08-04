import { EventEmitter } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormArray,
  Validators
} from '@angular/forms';
import { startWith } from 'rxjs/operators';



import { SchemaValidatorFactory } from '../schemavalidatorfactory';
import { ValidatorRegistry } from '../model/validatorregistry';
import { Schema, SchemaPropertyType } from '../schema';

import { FormProperty } from './form-property';
import { GenericProperty } from './generic-property';
import { NumberProperty } from './number-property';
import { BooleanProperty } from './boolean-property';
import { StringProperty } from './string-property';
import { ArrayProperty } from './array-property';
import { ObjectProperty } from './object-property';
import { SchemaPreprocessor } from './schemapreprocessor';


export type PropertyParent = ObjectProperty | ArrayProperty;


export class FormPropertyFactory {

  constructor(
    private schemaValidatorFactory: SchemaValidatorFactory,
    private validatorRegistry: ValidatorRegistry
  ) { }

  createProperty(
    schema: Schema,
    propertyParent?: PropertyParent,
    propertyKey?: string
  ): FormProperty {


    let property: FormProperty;
    const path = this.generatePath(propertyParent, propertyKey);

    SchemaPreprocessor.preprocess(schema, path);

    // TODO test for parsing for reference schema
    if (schema.$ref) {
      const refSchema = this.schemaValidatorFactory.getSchema(
        (<FormProperty>propertyParent.root).schema,
        schema.$ref
      );

      property = this.createProperty(
        refSchema,
        propertyParent,
        propertyKey || path
      );

    } else {
      switch (schema.type) {
        case SchemaPropertyType.Integer:
        case SchemaPropertyType.Number:
          property = new NumberProperty(path, schema);
          break;
        case SchemaPropertyType.String:
          property = new StringProperty(path, schema);
          break;
        case SchemaPropertyType.Boolean:
          property = new BooleanProperty(path, schema);
          break;
        case SchemaPropertyType.Object:
          property = new ObjectProperty(path, schema);
          break;
        case SchemaPropertyType.Array:
          if (schema.widget.id === 'array') {
            property = new ArrayProperty(this, path, schema);
          } else {
            schema.default = [];
            property = new GenericProperty(path, schema);
          }
          break;
        default:
          throw new TypeError(`Undefined type ${schema.type}`);
      }
    }


    this.initializeFormProperty(property, propertyParent);


    return property;
  }

  private initializeFormProperty(
    property: FormProperty,
    propertyParent?: PropertyParent,
  ) {

    if (propertyParent) {
      property.setParent(propertyParent);
    }

    this.bindCustomValidator(property);

    if (property instanceof ObjectProperty) {
      for (const key in property.schema.properties) {
        if (property.schema.properties.hasOwnProperty(key)) {
          const _schema = property.schema.properties[key];
          const _property = this.createProperty(_schema, property, key);
          property.addControl(key, _property);
        }
      }
    }

    if (property.isRoot) {
      this.bindSchemaValidator(property);
      // needs to run after entire property tree is built
      property.bindVisibility();
    }
  }

  private bindSchemaValidator(property: FormProperty) {

    const validate = this.schemaValidatorFactory.createValidatorFn(
      property.schema
    );

    // TODO use pipe startWith to do initial run
    property.valueChanges
      .pipe(startWith(null))
      .subscribe(() => {
        const value = property.nonEmptyValue;
        property.nonEmptyValueChanges.emit(value);

        const errors = validate(value);
        if (!errors) {
          return;
        }

        Object.keys(errors).forEach((path: string) => {
          const control = property.get(path);
          if (control) {
            // set error to specific control
            control.setErrors(errors[path], { emitEvent: true });
          }
        });
      });
  }

  private bindCustomValidator(property: FormProperty) {
    const validators = this.validatorRegistry.get(property.path);
    if (validators) {
      property.setValidators(validators);
    }
  }

  private generatePath(
    propertyParent?: PropertyParent,
    propertyKey?: string
  ): string {

    if (!propertyParent) {
      return '/';
    }

    let path = '';
    path += propertyParent.path;


    if (propertyParent.parent !== undefined) {
      path += '/';
    }

    switch (propertyParent.schema.type) {
      case SchemaPropertyType.Object:
        path += propertyKey;
        break;

      case SchemaPropertyType.Array:
        path += (<ArrayProperty>propertyParent).controls.length;
        break;

      default:
        // TODO move to class
        throw new Error(
          'Instantiation of a FormProperty with an unknown parent type: ' +
            propertyParent.schema.type
        );
    }

    return path;
  }
}
