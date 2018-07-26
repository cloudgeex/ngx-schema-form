import { TemplateRef } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { Action } from './model/action';
import { FormProperty } from './model/form-property';
import { ArrayProperty } from './model/array-property';
import { GenericProperty } from './model/generic-property';
import { ObjectProperty } from './model/object-property';

import { Schema } from './schema';


export abstract class Widget<T extends FormProperty = FormProperty> {
  formProperty: T;
}

export abstract class PropertyWidget<T extends FormProperty = FormProperty, U = any> extends Widget {
  id: string;
  formProperty: T;
  errorMessages: string[];

  schema: {
    [key: string]: any,
    widget: U
  };
  required?: boolean;
}

export class ArrayLayoutWidget extends PropertyWidget<ArrayProperty> { }

export class ObjectLayoutWidget extends PropertyWidget<ObjectProperty> { }

export class FieldsetLayoutWidget<T = any> extends Widget<ObjectProperty> {
  title: string;
  description: string;
  formProperties: FormProperty[];
  widget: T;
}
