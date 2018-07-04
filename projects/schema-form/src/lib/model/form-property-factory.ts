import { EventEmitter } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormArray,
  Validators
} from '@angular/forms';
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


type PropertyParent = ObjectProperty | ArrayProperty;


export class FormPropertyFactory {

  constructor(
    private schemaValidatorFactory: SchemaValidatorFactory,
    private validatorRegistry: ValidatorRegistry
  ) { }

  createProperty(
    schema: Schema,
    parent?: { key?: string; property: PropertyParent }
  ): FormProperty {

    let property: FormProperty;
    const defaultValue = schema.default;

    switch (schema.type) {
      case SchemaPropertyType.Integer:
      case SchemaPropertyType.Number:
        property = new NumberProperty(defaultValue);
        break;
      case SchemaPropertyType.String:
        property = new StringProperty(defaultValue);
        break;
      case SchemaPropertyType.Boolean:
        property = new BooleanProperty(defaultValue);
        break;
      case SchemaPropertyType.Object:
        property = new ObjectProperty();
        break;
      case SchemaPropertyType.Array:
        if (schema.widget.id === 'array') {
          property = new ArrayProperty(this);
        } else {
          property = new GenericProperty([]);
        }
        break;
      default:
        throw new TypeError(`Undefined type ${schema.type}`);
    }

    this.initializeFormProperty(property, schema, parent);

    if (property.isRoot) {
      property.bindVisibility();
    }

    return property;
  }

  private initializeFormProperty(
    property: FormProperty,
    schema: Schema,
    parent?: { key?: string; property: PropertyParent }
  ) {

    const path = this.generatePath(parent);
    property.setPath(path);
    property.setSchema(schema);

    if (parent && parent.property) {
      property.setParent(parent.property);
    }

    if (property.isRoot) {
      const fn = this.schemaValidatorFactory.createValidatorFn(property.schema);
      property.setSchemaValidator(fn);
    }

    const validators = this.validatorRegistry.get(path);
    if (validators) {
      property.setValidators(validators);
    }

    if (property instanceof ObjectProperty) {
      const group = <ObjectProperty>property;
      for (const key in group.schema.properties) {
        if (group.schema.properties.hasOwnProperty(key)) {
          const propertySchema = group.schema.properties[key];
          const _property = this.createProperty(
            propertySchema,
            { key, property: group }
          );
          group.addControl(key, _property);
        }
      }
    }


  }

  private generatePath(
    parent?: { key?: string; property: PropertyParent }
  ): string {

    if (!parent) {
      return '/';
    }

    const { key, property } = parent;

    let path = '';
    path += property.path;
    if (property.parent !== undefined) {
      path += '/';
    }

    if (property.schema.type === SchemaPropertyType.Object) {
      path += key;
    } else if (property.schema.type === SchemaPropertyType.Array) {
      path += '*';
    } else {
      // TODO move to class
      throw new Error(
        'Instanciation of a GenericProperty with an unknown parent type: ' +
          property.schema.type
      );
    }

    return path;
  }
}
