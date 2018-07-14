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
import { Observable, Subscription } from 'rxjs';
import { filter, startWith, distinctUntilChanged } from 'rxjs/operators';

import { TerminatorService } from './terminator.service';
import { WidgetFactory } from './widgetfactory';
import { FormProperty } from './model/form-property';
import { GenericProperty } from './model/generic-property';


@Directive({
  selector: '[sfWidgetChooser]',
})
export class WidgetChooserDirective implements OnInit, OnDestroy, OnChanges {

  static widgetCount = 0;

  @Input()
  formProperty: FormProperty;

  private componentRef: ComponentRef<any>;
  private subs: Subscription;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private widgetFactory: WidgetFactory = null,
    private terminator: TerminatorService,
  ) { }

  ngOnInit() {

    this.subs = this.terminator.onDestroy.subscribe(destroy => {
      if (destroy) {
        this.destroyComponentRef();
      }
    });

  }

  ngOnChanges() {
    WidgetChooserDirective.widgetCount++;
    this.componentRef = this.widgetFactory.createWidget(
      this.viewContainerRef,
      this.formProperty.schema.widget.id
    );

    const component = this.componentRef.instance;
    component.formProperty = this.formProperty;
    component.control = this.formProperty;
    component.schema = this.formProperty.schema;
    component.id = 'field' + WidgetChooserDirective.widgetCount;

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
    this.subs.unsubscribe();
    this.destroyComponentRef();
    WidgetChooserDirective.widgetCount = 0;
  }
}
