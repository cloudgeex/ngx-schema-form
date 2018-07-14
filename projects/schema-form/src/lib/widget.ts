import { AfterViewInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';

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
