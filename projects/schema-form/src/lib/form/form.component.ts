import {
  Component,
  OnChanges,
  Input,
  SimpleChanges
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ValidatorFn
} from '@angular/forms';

import { Action } from '../model/action';
import { ActionRegistry } from '../model/actionregistry';
import { SchemaPreprocessor } from '../model/schemapreprocessor';
import { ValidatorRegistry } from '../model/validatorregistry';
import { SchemaPropertyType } from '../schema';
import { SchemaValidatorFactory } from '../schemavalidatorfactory';
import { WidgetFactory } from '../widgetfactory';
import { TerminatorService } from '../terminator.service';
import { FormPropertyFactory } from '../model/form-property-factory';
import { FormProperty } from '../model/form-property';

export function useFactory(schemaValidatorFactory, validatorRegistry) {
  return new FormPropertyFactory(schemaValidatorFactory, validatorRegistry);
}

@Component({
  selector: 'sf-form',
  template: `
    <form>
      <sf-form-element
        *ngIf="rootFormProperty"
        [formProperty]="rootFormProperty">
      </sf-form-element>
    </form>`,
  providers: [
    ActionRegistry,
    ValidatorRegistry,
    SchemaPreprocessor,
    WidgetFactory,
    {
      provide: FormPropertyFactory,
      useFactory: useFactory,
      deps: [SchemaValidatorFactory, ValidatorRegistry]
    },
    TerminatorService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FormComponent,
      multi: true
    }
  ]
})
export class FormComponent implements OnChanges, ControlValueAccessor {

  @Input()
  schema: any = null;

  @Input()
  actions: { [actionId: string]: Action } = {};

  @Input()
  validators: { [path: string]: ValidatorFn | ValidatorFn[] } = {};

  rootFormProperty: FormProperty = null;

  private onChangeCallback: any;

  constructor(
    private formPropertyFactory: FormPropertyFactory,
    private actionRegistry: ActionRegistry,
    private validatorRegistry: ValidatorRegistry,
    private terminator: TerminatorService
  ) {}

  writeValue(value: any) {
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
        value = this.rootFormProperty.value;
      }

      this.terminator.destroy();

      SchemaPreprocessor.preprocess(this.schema);
      this.rootFormProperty = this.formPropertyFactory.createProperty(
        this.schema
      );

      // registerOnChange for changes after init
      if (this.onChangeCallback) {
        this.rootFormProperty.nonEmptyValueChanges.subscribe(
          this.onChangeCallback
        );
        if (value) {
          this.rootFormProperty.patchValue(value);
        }
      }
    }
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
