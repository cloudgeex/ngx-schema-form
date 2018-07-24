import { TemplateRef } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { Action } from './model/action';
import { FormProperty } from './model/form-property';
import { ArrayProperty } from './model/array-property';
import { GenericProperty } from './model/generic-property';
import { ObjectProperty } from './model/object-property';

import { Schema } from './schema';

export abstract class Widget<T extends FormProperty> {
  formProperty: T;
  errorMessages: string[];

  id = '';
  name = '';
  schema: Schema = {};
}

export class ControlWidget extends Widget<GenericProperty> { }

export class ArrayLayoutWidget extends Widget<ArrayProperty> { }

export class ObjectLayoutWidget extends Widget<ObjectProperty> { }

export class FieldsetLayoutWidget<T = any> extends Widget<ObjectProperty> {
  title: string;
  description: string;
  formProperties: FormProperty[];
  widget: string | T;
}

export abstract class ButtonWidget<T = any> {
  formProperty: FormProperty;
  id = '';
  label = '';
  widget: string | T = 'button';
  // TODO use function signature
  action?: Action;
}


