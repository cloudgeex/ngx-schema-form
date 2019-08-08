import {
  ChangeDetectorRef,
  Component,
  forwardRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgForm, ValidatorFn } from '@angular/forms';

import { Action } from '../model/action';
import { ActionRegistry } from '../model/actionregistry';
import { ValidatorRegistry } from '../model/validatorregistry';
import { SchemaPropertyType } from '../schema';
import { SchemaValidatorFactory } from '../schemavalidatorfactory';
import { WidgetFactory } from '../widgetfactory';
import { FormPropertyFactory } from '../model/form-property-factory';
import { GroupProperty } from '../model/group-property';
import { TemplateSchemaElementRegistry } from '../template-schema/template-schema-element-registry';
import { Binding } from '../model/binding';
import { BindingRegistry } from '../model/bindingregistry';

export function useFactory(schemaValidatorFactory, validatorRegistry) {
  return new FormPropertyFactory(schemaValidatorFactory, validatorRegistry);
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
    BindingRegistry,
    WidgetFactory,
    {
      provide: FormPropertyFactory,
      useFactory: useFactory,
      deps: [SchemaValidatorFactory, ValidatorRegistry]
    },
    TemplateSchemaElementRegistry
  ],
  encapsulation: ViewEncapsulation.None,
  exportAs: 'form'
})
export class FormComponent implements OnInit, OnChanges, ControlValueAccessor {

  @Input()
  schema: any = null;

  @Input()
  actions: { [actionId: string]: Action } = {};

  @Input()
  validators: { [path: string]: ValidatorFn | ValidatorFn[] } = {};

  @Input()
  bindings: { [path: string]: Binding };

  rootFormProperty: GroupProperty | null = null;

  @ViewChild(NgForm)
  private ngForm: NgForm;

  private onChangeCallback: any;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private formPropertyFactory: FormPropertyFactory,
    private actionRegistry: ActionRegistry,
    private validatorRegistry: ValidatorRegistry,
    private bindingRegistry: BindingRegistry,
  ) {
  }

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
  registerOnTouched(fn: any) {
  }

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

  validate(): boolean {
    if (!this.ngForm || !this.rootFormProperty) {
      return false;
    }
    this.ngForm.ngSubmit.emit();
    this.rootFormProperty.markAllAsTouched();
    return this.rootFormProperty.valid;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.validators) {
      this.registerValidators();
    }

    if (changes.actions) {
      this.registerActions();
    }

    if (changes.bindings) {
      this.setBindings();
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

      // SchemaPreprocessor is now done in formPropertyFactory using property
      // creation recursion, this removes the need to traverse the tree twice.
      // TODO test schema preprocessing move
      const rootFormProperty = this.formPropertyFactory.createProperty(
        this.schema
      ) as GroupProperty;

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

  private setBindings() {
    this.bindingRegistry.clear();
    if (this.bindings) {
      for (const bindingPath in this.bindings) {
        if (this.bindings.hasOwnProperty(bindingPath)) {
          this.bindingRegistry.register(bindingPath, this.bindings[bindingPath]);
        }
      }
    }
  }
}
