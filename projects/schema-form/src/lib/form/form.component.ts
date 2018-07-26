import {
  Component,
  OnChanges,
  Input,
  SimpleChanges,
  forwardRef,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  OnInit
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ValidatorFn,
  NgForm
} from '@angular/forms';

import { Action } from '../model/action';
import { ActionRegistry } from '../model/actionregistry';
import { SchemaPreprocessor } from '../model/schemapreprocessor';
import { ValidatorRegistry } from '../model/validatorregistry';
import { SchemaPropertyType } from '../schema';
import { SchemaValidatorFactory } from '../schemavalidatorfactory';
import { WidgetFactory } from '../widgetfactory';
import { FormPropertyFactory } from '../model/form-property-factory';
import { FormProperty } from '../model/form-property';
import { FieldRegistry } from '../template-schema/field/field-registry';

export function useFactory(schemaValidatorFactory, validatorRegistry) {
  return new FormPropertyFactory(schemaValidatorFactory, validatorRegistry);
}

export enum FormAction {
  MarkAsSubmitted = '_mark_as_submitted'
}

@Component({
  selector: 'sf-form',
  template: `
    <form #form="ngForm">
      <sf-form-element *ngIf="rootFormProperty; else noSchema" [formProperty]="rootFormProperty">
      </sf-form-element>
      <ng-template #noSchema>
        You need to provide a json or a template schema!
      </ng-template>
    </form>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormComponent),
      multi: true
    },
    ActionRegistry,
    ValidatorRegistry,
    SchemaPreprocessor,
    WidgetFactory,
    {
      provide: FormPropertyFactory,
      useFactory: useFactory,
      deps: [SchemaValidatorFactory, ValidatorRegistry]
    },
    FieldRegistry
  ]
})
export class FormComponent implements OnInit, OnChanges, ControlValueAccessor {

  @ViewChild(NgForm)
  form: NgForm;

  @Input()
  schema: any = null;

  @Input()
  actions: { [actionId: string]: Action } = {};

  @Input()
  validators: { [path: string]: ValidatorFn | ValidatorFn[] } = {};

  rootFormProperty: FormProperty = null;

  private onChangeCallback: any;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private formPropertyFactory: FormPropertyFactory,
    private actionRegistry: ActionRegistry,
    private validatorRegistry: ValidatorRegistry,
  ) {}

  writeValue(value: any) {
    // value should be object
    if (this.rootFormProperty && value) {
      this.rootFormProperty.patchValue(value);
    }
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
    if (this.rootFormProperty) {
      this.rootFormProperty.nonEmptyValueChanges.subscribe(fn);
    }
  }

  // TODO implement
  registerOnTouched(fn: any) {}

  setDisabledState(isDisabled: boolean) {
    if (!this.rootFormProperty) {
      return;
    }

    if (isDisabled) {
      this.rootFormProperty.disable();
    } else {
      this.rootFormProperty.enable();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.validators) {
      this.registerValidators();
    }

    if (changes.actions) {
      this.registerActions();
    }

    if (this.schema && !this.schema.type) {
      this.schema.type = SchemaPropertyType.Object;
    }


    if (this.schema && changes.schema) {
      let value: any;
      if (this.rootFormProperty) {
        // TODO validate model against schema
        value = this.rootFormProperty.nonEmptyValue;
      }

      // force component destruction
      this.rootFormProperty = null;
      this.changeDetectorRef.detectChanges();

      SchemaPreprocessor.preprocess(this.schema);
      const rootFormProperty = this.formPropertyFactory.createProperty(
        this.schema
      );
      (<any>window).rootFormProperty = rootFormProperty;

      // registerOnChange for changes after init
      if (this.onChangeCallback) {
        rootFormProperty.nonEmptyValueChanges.subscribe(
          this.onChangeCallback
        );
        if (value) {
          rootFormProperty.patchValue(value);
        }
      }

      this.rootFormProperty = rootFormProperty;
    }
  }

  ngOnInit() {

    this.actionRegistry.register(
      FormAction.MarkAsSubmitted,
      this.markAsSubmitted.bind(this)
    );
  }

  markAsSubmitted() {
    this.form.ngSubmit.emit();
    (<any>this.form).submitted = true;
  }

  private registerValidators() {
    this.validatorRegistry.clear();
    if (!this.validators) {
      return;
    }

    for (const propertyPath in this.validators) {
      if (this.validators.hasOwnProperty(propertyPath)) {
        this.validatorRegistry.register(
          propertyPath,
          this.validators[propertyPath]
        );
      }
    }
  }

  private registerActions() {
    this.actionRegistry.clear();
    if (!this.actions) {
      return;
    }

    for (const actionId in this.actions) {
      if (this.actions.hasOwnProperty(actionId)) {
        this.actionRegistry.register(actionId, this.actions[actionId]);
      }
    }
  }
}
