import { TemplateRef } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { Action } from '../../model/action';
import { FormProperty } from '../../model/form-property';
import { ArrayProperty } from '../../model/array-property';
import { GenericProperty } from '../../model/generic-property';
import { ObjectProperty } from '../../model/object-property';

import { Schema } from '../../schema';


export abstract class Widget {
  id: string;
}

export class FieldsetLayoutWidget<T = Widget> extends Widget {
  formProperty: ObjectProperty;
  title: string;
  description: string;
  formProperties: FormProperty[];
  widget: T;
}

export abstract class ButtonLayoutWidget<T extends Widget = Widget> extends Widget {

  formProperty?: FormProperty;
  label?: string;

  action?: Action;
  widget: T;
}

export abstract class PropertyWidget<T extends Widget = Widget, U extends FormProperty = FormProperty>
extends Widget {
  formProperty: U;
  errorMessages: string[];

  schema: {
    [key: string]: any,
    widget: T
  };
  required?: boolean;
}

export class ArrayPropertyWidget<T extends Widget = Widget>
extends PropertyWidget<T, ArrayProperty> {
  /*
  schema: {
    [key: string]: any,
    widget: T
  };
  */
}

export class ObjectPropertyWidget<T extends Widget = Widget>
extends PropertyWidget<T, ObjectProperty> {
  /*
  schema: {
    [key: string]: any,
    widget: T
  };
  */
}

