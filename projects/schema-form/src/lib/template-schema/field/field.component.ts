import {
  Component,
  Input,
  Output,
  OnInit,
  AfterContentInit,
  ContentChildren,
  ViewChild,
  QueryList,
  ElementRef,
  forwardRef,
  SimpleChanges,
  SimpleChange,
  OnChanges,
  EventEmitter
} from '@angular/core';
import { ValidatorFn } from '@angular/forms';
import { Observable, merge } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Action } from '../../model/action';
import { ActionRegistry } from '../../model/actionregistry';
import { SchemaPropertyType } from '../../schema';

import { TemplateSchemaElement } from '../template-schema-element';
import { TemplateSchemaService } from '../template-schema.service';
import { ButtonComponent } from '../button/button.component';

import { FieldParent } from './field-parent';
import { Field } from './field';
import { ItemComponent } from './item/item.component';
import { FieldRegistry } from './field-registry';


@Component({
  selector: 'sf-field',
  templateUrl: './field.component.html'
})
export class FieldComponent extends FieldParent implements Field, OnChanges, AfterContentInit {

  @ContentChildren(FieldComponent)
  childFields: QueryList<FieldComponent>;

  @ContentChildren(ItemComponent)
  childItems: QueryList<ItemComponent>;

  @ContentChildren(ButtonComponent)
  childButtons: QueryList<ButtonComponent>;

  @Input()
  name: string;

  @Input()
  type: SchemaPropertyType;

  @Input()
  format: string;

  @Input()
  required: boolean;

  @Input()
  readOnly: boolean;

  @Input()
  title: string;

  @Input()
  description: string;

  @Input()
  placeholder: string;

  @Input()
  widget: string | object;

  @Input()
  validators: ValidatorFn | ValidatorFn[];

  @Input()
  schema: any = { };

  changes = new EventEmitter();

  constructor(
    private elementRef: ElementRef,
    private templateSchemaService: TemplateSchemaService,
    private fieldRegistry: FieldRegistry,
    protected actionRegistry: ActionRegistry
  ) {
    super();
  }

  getSchema(): any {

    const { properties, items, required } = this.getFieldsSchema(
      this.childFields.filter(field => field !== this)
    );

    const oneOf = this.getOneOf();

    let type: string;
    if (!this.type && properties) {
      type = SchemaPropertyType.Object;
    } else if (!this.type) {
      type = SchemaPropertyType.String;
    } else {
      type = this.type;
    }

    const schema = <any>{
      type
    };

    if (this.title !== undefined) {
      schema.title = this.title;
    }

    if (properties !== undefined) {
      schema.properties = properties;
    }

    if (items !== undefined) {
      schema.items = items;
    }

    // requried child fields
    if (required !== undefined) {
      schema.required = required;
    }

    if (oneOf !== undefined) {
      schema.oneOf = oneOf;
    }

    if (this.description !== undefined) {
      schema.description = this.description;
    }

    if (this.placeholder !== undefined) {
      schema.placeholder = this.placeholder;
    }

    if (this.format !== undefined) {
      schema.format = this.format;
    }

    if (this.widget !== undefined) {
      schema.widget = this.widget;
    }

    if (this.readOnly !== undefined) {
      schema.readOnly = this.readOnly;
    }

    const buttons = this.getButtons();
    if (buttons.length > 0) {
      schema.buttons = buttons;
    }

    // @Input schema takes precedence
    return Object.assign(schema, this.schema);

  }

  getValidators(): { path: string, validators: ValidatorFn | ValidatorFn[] }[] {

    // registering validator here is not possible since prop full path is needed
    const childValidators = this.getFieldsValidators(
      <Field[]>this.childFields.filter(field => field !== this)
    );
    const _validators = childValidators.map(({ path, validators }) => {
      return {
        path: this.path + path,
        validators
      };
    });

    if (!this.validators) {
      return _validators;
    }

    _validators.push({ path: this.path, validators: this.validators });
    return _validators;
  }

  register(parentFieldPath = '') {
    const path = parentFieldPath + this.path;
    this.fieldRegistry.register(path, this);
    if (this.childFields.length) {
      this.childFields.forEach((field) => {
        if (field === this) {
          return;
        }

        field.register(path);
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {

    const keys = Object.keys(changes);
    if (keys.length > 0) {
      for (const key of keys) {
        if (!changes[key].isFirstChange()) {
          // on any input change, force schema change generation
          this.templateSchemaService.changed();
          break;
        }
      }

      if (this.childFields) {
        const schema = this.getSchema();
        delete schema.name;
        delete schema.format;
        if (typeof schema.widget === 'string') {
          delete schema.widget;
        } else if (schema.widget && schema.width.id) {
          delete schema.widget.id;
        }
        this.changes.emit(schema);
      }
    }

  }


  private getOneOf() {

    if (this.childItems.length === 0) {
      return;
    }

    const items = this.childItems.map(({ value, description }) => {
      if (!Array.isArray(value)) {
        return { enum: [value], description };
      }

      return { enum: value, description };
    });

    if (items.length === 0) {
      return;
    }

    return items;
  }


  private setTitleFromContent() {
    const textContent = this.getTextContent(this.elementRef);

    //  title as @Input takes priority over content text
    if (textContent && !this.title) {
      this.title = textContent;
    }
  }

  ngAfterContentInit() {

    // cache it
    this.setTitleFromContent();

    merge(
      this.childFields.changes,
      this.childItems.changes,
      this.childButtons.changes
    )
    .pipe(filter((value) => Boolean(value)))
    .subscribe(() => {
      this.templateSchemaService.changed();
    });
  }

}
