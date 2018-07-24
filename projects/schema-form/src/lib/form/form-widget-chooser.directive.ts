import {
  Directive,
  ComponentRef,
  Input,
  ViewChild,
  ViewContainerRef,
  OnInit,
  OnDestroy,
  OnChanges
} from '@angular/core';
import {
  filter,
  startWith,
  distinctUntilChanged,
  take,
  takeUntil
} from 'rxjs/operators';

import { TerminatorService } from '../terminator.service';
import { Widget } from '../widget';
import { WidgetFactory } from '../widgetfactory';
import { FormProperty } from '../model/form-property';
import { GenericProperty } from '../model/generic-property';
import { FieldRegistry } from '../template-schema/field/field-registry';


@Directive({
  selector: '[sfWidgetChooser]',
})
export class WidgetChooserDirective implements OnInit, OnDestroy, OnChanges {

  @Input()
  formProperty: FormProperty;

  private componentRef: ComponentRef<any>;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private widgetFactory: WidgetFactory = null,
    private terminator: TerminatorService,
    private fieldRegsitry: FieldRegistry
  ) { }

  ngOnInit() {

    this.terminator.destroyed.pipe(take(1)).subscribe(() => {
      this.destroyComponentRef();
    });

  }

  ngOnChanges() {

    this.componentRef = this.widgetFactory.createWidget(
      this.viewContainerRef,
      this.formProperty.schema.widget.id
    );

    const component = <Widget<any>>this.componentRef.instance;
    component.formProperty = this.formProperty;
    component.schema = this.formProperty.schema;
    component.id = this.formProperty.id;

    // templateSchema field updates
    const field = this.fieldRegsitry.getField(this.formProperty.path);
    if (field) {

      if (field.required) {
        component.schema.widget.required = field.required;
      }

      field.changes
        .pipe(takeUntil(this.terminator.destroyed))
        .subscribe((schema) => {
          component.schema = Object.assign(this.formProperty.schema, schema);
          this.componentRef.changeDetectorRef.detectChanges();
        });
    }

    this.formProperty.widgetInstance = component;

    if (this.formProperty instanceof GenericProperty) {
      this.formProperty.statusChanges
        .pipe(
          filter((status: string) => {
            const errorMessages = component.errorMessages;
            const hasErrorMessages = errorMessages && errorMessages.length > 0;
            return status === 'INVALID' || status === 'VALID' && hasErrorMessages;
          }),
          distinctUntilChanged()
        )
        .subscribe(() => {
          const propertyErrors = this.formProperty.getErrors();

          if (!propertyErrors) {
            this.componentRef.instance.errorMessages = [];
            return;
          }

          const errorMessages = propertyErrors.getMessages();
          component.errorMessages = errorMessages;
        });
    }

  }

  destroyComponentRef() {
    this.componentRef.destroy();
    this.viewContainerRef.clear();
  }

  ngOnDestroy() {
    this.destroyComponentRef();
  }
}
