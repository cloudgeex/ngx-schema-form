import {
  Directive,
  ComponentRef,
  Input,
  ViewContainerRef,
  OnInit,
  OnDestroy
} from '@angular/core';
import { take, takeUntil } from 'rxjs/operators';

import { Unsubscriber } from '../unsubscriber';
import { WidgetFactory } from '../widgetfactory';
import { ButtonLayoutWidget } from '../widget';
import { WidgetType } from '../widgetregistry';

@Directive({
  selector: '[sfFormButtonWidgetChooser]'
})
export class FormButtonWidgetChooserDirective implements OnInit, OnDestroy {

  @Input()
  button: any;

  @Input()
  formProperty: any;

  private componentRef: ComponentRef<any>;

  @Unsubscriber()
  private subs;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private widgetFactory: WidgetFactory,
  ) { }


  getWidget(): any  {
    const id = 'button';
    if (!this.button.widget) {
      return { id };
    }

    if (!this.button.widget.id) {
      this.button.widget.id = id;
    }

    return this.button.widget;
  }

  ngOnInit() {
    const widget = this.getWidget();
    this.componentRef = this.widgetFactory.createWidget<ButtonLayoutWidget>(
      this.viewContainerRef,
      widget.id,
      {
        type: WidgetType.Button
      }
    );

    const instance = this.componentRef.instance;
    instance.id = this.button.id;
    instance.label = this.button.label;
    instance.action = this.button.action;
    instance.widget = widget;
    instance.formProperty = this.formProperty;

    // watch changes on field if template schema is used
    if (this.button.field) {
      this.subs = this.button.field.changes
        .subscribe((button) => {
          // TODO make sure widget id is not changed
          // TODO widget id change should trigger a form rebuild
          instance.label = button.label;
          if (typeof button.widget !== 'string') {
            Object.assign(instance.widget, button.widget);
          }
          this.componentRef.changeDetectorRef.detectChanges();
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
