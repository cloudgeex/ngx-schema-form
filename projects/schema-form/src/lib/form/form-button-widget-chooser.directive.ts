import {
  Directive,
  ComponentRef,
  Input,
  ViewContainerRef,
  OnInit,
  OnDestroy
} from '@angular/core';
import { take, takeUntil } from 'rxjs/operators';

import { ActionRegistry } from '../model/actionregistry';
import { Action } from '../model/action';
import { Unsubscriber } from '../unsubscriber';
import { WidgetFactory } from '../widgetfactory';
import { ButtonLayoutWidget } from '../widget';
import { WidgetType } from '../widgetregistry';
import { FormAction } from '../form/form.component';

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
    private actionRegistry: ActionRegistry
  ) { }


  // TODO return proper ButtonWidget type
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

  getButtonAction(widget: any): Action {

    return (event) => {

      // TODO rethink this, ActionRegistry is doing more than it should
      if (widget.onInvalidProperty.markAsSubmitted) {
        this.actionRegistry.get(FormAction.MarkAsSubmitted).action();
      }

      if (widget.onInvalidProperty.preventClick) {
        return;
      }

      if (!this.button.action) {
        return;
      }

      this.button.action(event);
    };

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
    instance.formProperty = this.formProperty;
    if (instance.widget) {
      // for widget defaults
      Object.assign(instance.widget, widget);
    } else {
      instance.widget = widget;
    }
    // after widget has been merged with defaults
    instance.action = this.getButtonAction(widget);

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
          // TODO dont rebuild if there is no changes
          // rebuild action in case onInvalidProperty changed
          instance.action = this.getButtonAction(widget);

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
