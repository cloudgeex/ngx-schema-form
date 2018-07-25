import {
  Directive,
  ComponentRef,
  Input,
  ViewContainerRef,
  OnInit,
  OnDestroy
} from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import {
  filter,
  startWith,
  distinctUntilChanged,
  take,
  takeUntil
} from 'rxjs/operators';

import { Unsubscriber } from '../unsubscriber';
import { WidgetLayout } from '../widget';
import { WidgetFactory } from '../widgetfactory';
import { FormProperty } from '../model/form-property';
import { GenericProperty } from '../model/generic-property';
import { FieldRegistry } from '../template-schema/field/field-registry';


@Directive({
  selector: '[sfFormPropertyWidgetChooser]',
})
export class FormPropertyWidgetChooserDirective implements OnInit, OnDestroy {

  @Input()
  formProperty: FormProperty;

  private componentRef: ComponentRef<any>;

  @Unsubscriber()
  private subs;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private widgetFactory: WidgetFactory,
    private fieldRegsitry: FieldRegistry
  ) { }

  isWidgetRequired(): boolean {
    const parent = (<AbstractControl>this.formProperty.parent) as FormProperty;
    if (!parent || !parent.schema.required) {
      return false;
    }

    return parent.schema.required.includes(this.formProperty.name);
  }

  ngOnInit() {

    // TODO break into functions

    this.componentRef = this.widgetFactory.createWidget(
      this.viewContainerRef,
      this.formProperty.schema.widget.id
    );

    const component = <WidgetLayout<any>>this.componentRef.instance;
    component.formProperty = this.formProperty;
    component.schema = this.formProperty.schema;
    component.id = this.formProperty.id;

    // templateSchema field updates
    const field = this.fieldRegsitry.getField(this.formProperty.path);
    if (field) {
      this.subs = field.changes.subscribe((schema) => {
        component.schema = Object.assign(this.formProperty.schema, schema);
        this.componentRef.changeDetectorRef.detectChanges();
      });
    }

    // required field
    component.schema.widget.required = this.isWidgetRequired();

    // widget instance in formProperty
    this.formProperty.widgetInstance = component;

    // error messages
    if (this.formProperty instanceof GenericProperty) {
      this.subs = this.formProperty.statusChanges
        .pipe(
          // initial, to add error messages from schema validator
          startWith('INVALID'),
          filter((status: string) => {
            const errorMessages = component.errorMessages;
            const hasErrorMessages = errorMessages && errorMessages.length > 0;

            // it's valid, but error messages need to be cleared
            if (status === 'VALID' && hasErrorMessages) {
              return true;
            }

            return status === 'INVALID';
          }),
          distinctUntilChanged()
        )
        .subscribe(() => {
          const propertyErrors = this.formProperty.getErrors();

          if (!propertyErrors) {
            // clear errors emssages
            this.componentRef.instance.errorMessages = [];
            return;
          }

          const errorMessages = propertyErrors.getMessages();
          component.errorMessages = errorMessages;
        });
    }

  }

  ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
    if (this.viewContainerRef) {
      this.viewContainerRef.clear();
    }
  }
}
