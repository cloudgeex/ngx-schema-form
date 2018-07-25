import {
  Directive,
  ComponentRef,
  Input,
  OnChanges,
  ViewContainerRef,
  OnInit,
  OnDestroy
} from '@angular/core';
import { Subscription } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { WidgetFactory } from '../widgetfactory';
import { ButtonWidget } from '../widget';
import { WidgetType } from '../widgetregistry';

@Directive({
  selector: '[sfFormElementAction]'
})
export class FormElementActionDirective implements OnInit, OnChanges, OnDestroy {

  @Input()
  button: any;

  @Input()
  formProperty: any;

  private componentRef: ComponentRef<any>;
  private subs: Subscription;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private widgetFactory: WidgetFactory,
  ) { }

  ngOnInit() {
  }

  getWidgetId(): string {
    if (!this.button.widget || !this.button.widget.id) {
      return 'button';
    }

    return this.button.widget.id;
  }

  ngOnChanges() {
    this.componentRef = this.widgetFactory.createWidget<ButtonWidget>(
      this.viewContainerRef,
      this.getWidgetId(),
      {
        type: WidgetType.Button
      }
    );

    const instance = this.componentRef.instance;
    instance.id = this.button.id;
    instance.label = this.button.label;
    instance.action = this.button.action;
    instance.widget = this.button.widget;
    instance.formProperty = this.formProperty;

    if (this.button.field) {
      this.subs = this.button.field.changes
        .subscribe((button) => {
          // TODO make sure widget id is not changed
          instance.label = button.label;
          Object.assign(instance.widget, button.widget);
          this.componentRef.changeDetectorRef.detectChanges();
        });
    }
  }

  ngOnDestroy() {

    if (this.subs) {
      this.subs.unsubscribe();
    }

    this.componentRef.destroy();
    this.viewContainerRef.clear();
  }
}
