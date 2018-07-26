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
import { FormProperty } from '../model/form-property';
import { Unsubscriber } from '../unsubscriber';
import { WidgetFactory } from '../widgetfactory';
import { ButtonWidget } from '../widgets/base';
import { WidgetType } from '../widgetregistry';
import { Widget } from '../widget';
import { FormAction } from '../form/form.component';

@Directive({
  selector: '[sfFormButtonWidgetChooser]'
})
export class FormButtonWidgetChooserDirective implements OnInit, OnDestroy {

  @Input()
  button: any;

  @Input()
  formProperty: FormProperty;

  private componentRef: ComponentRef<ButtonWidget>;

  @Unsubscriber()
  private subs;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private widgetFactory: WidgetFactory,
    private actionRegistry: ActionRegistry
  ) { }


  getWidget(): Widget  {
    const id = 'button';
    if (!this.button.widget) {
      return { id };
    }

    if (!this.button.widget.id) {
      this.button.widget.id = id;
    }

    return this.button.widget;
  }

  getButtonAction(widget: ButtonWidget): Action {

    return (event) => {

      // TODO rethink this, ActionRegistry is doing more than it should
      if (widget.onInvalidProperty.markFormAsSubmitted) {
        this.actionRegistry.get(FormAction.MarkAsSubmitted).action();
      }

      console.log(this.formProperty.invalid)
      if (this.formProperty.invalid && widget.onInvalidProperty.preventClick) {
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
    this.componentRef = this.widgetFactory.createWidget<ButtonWidget>(
      this.viewContainerRef,
      widget.id,
      {
        type: WidgetType.Button
      }
    );

    const instance = this.componentRef.instance;
    instance.label = this.button.label;
    instance.formProperty = this.formProperty;

    if (instance.widget) {
      Object.assign(instance.widget, widget);
    } else {
      instance.widget = widget;
    }

    // after widget has been merged with defaults
    instance.action = this.getButtonAction(instance);

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
          instance.action = this.getButtonAction(instance);

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
