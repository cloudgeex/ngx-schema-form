import { TemplateRef } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { Action } from './model/action';
import { FormProperty } from './model/form-property';
import { ArrayProperty } from './model/array-property';
import { GenericProperty } from './model/generic-property';
import { ObjectProperty } from './model/object-property';

import { Schema } from './schema';

// TODO replace defautl widgets with components and create default abstract types
export abstract class Widget {
  id: string;
  required?: boolean;
}

export abstract class WidgetLayout<T extends FormProperty> {
  formProperty: T;
  errorMessages: string[];

  id = '';
  name = '';
  schema: Schema = {};
}

export class ControlWidget extends WidgetLayout<GenericProperty> { }

export class ArrayLayoutWidget extends WidgetLayout<ArrayProperty> { }

export class ObjectLayoutWidget extends WidgetLayout<ObjectProperty> { }

export class FieldsetLayoutWidget<T = any> extends WidgetLayout<ObjectProperty> {
  title: string;
  description: string;
  formProperties: FormProperty[];
  widget: T;
}

export abstract class ButtonLayoutWidget<T = any> {
  formProperty: FormProperty;
  id = '';
  label = '';

  // TODO use T only
  widget: T;
  action?: Action;
}


