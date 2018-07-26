import {
  Directive,
  ComponentRef,
  Input,
  ViewContainerRef,
  OnInit,
  OnDestroy
} from '@angular/core';
import { filter, distinctUntilChanged } from 'rxjs/operators';

import { ActionRegistry } from '../model/actionregistry';
import { Action, ActionEvent } from '../model/action';
import { FormProperty } from '../model/form-property';
import { Unsubscriber } from '../unsubscriber';
import { WidgetFactory } from '../widgetfactory';
import { ButtonWidget } from '../widgets/base';
import { WidgetType } from '../widgetregistry';
import { Widget } from '../widgets/base/widget';
import {
  TemplateElementType,
  TemplateSchemaElementRegistry
} from '../template-schema/template-schema-element-registry';
import {
  ButtonComponent
} from '../template-schema/button/button.component';


@Directive({
  selector: '[sfFormButtonWidgetChooser]'
})
export class FormButtonWidgetChooserDirective implements OnInit, OnDestroy {

  @Input()
  button: ButtonWidget; // from schema

  @Input()
  formProperty: FormProperty;

  private componentRef: ComponentRef<ButtonWidget>;

  @Unsubscriber()
  private subs;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private widgetFactory: WidgetFactory,
    private actionRegistry: ActionRegistry,
    private templateRegistry: TemplateSchemaElementRegistry
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

  getButtonAction(widgetInstance: ButtonWidget): (event, params?) => void {

    return (event, params?): void => {

      const options = this.button.options;
      if (this.formProperty.invalid && options.onInvalidFormProperty.preventClick) {
        return;
      }

      const action = this.actionRegistry.get(this.button.id);
      if (!action) {
        return;
      }

      action({ event, formProperty: this.formProperty }, params);

      if (event.hasOwnProperty('preventDefault')) {
        event.preventDefault();
      }
    };

  }

  bindTemplateChanges() {
    const element = this.templateRegistry.getElement<ButtonComponent>(
      this.button.id,
      TemplateElementType.Button
    );

    if (!element) {
      return;
    }

    // templateSchema button changes
    this.subs = element.changes.subscribe((button) => {

      const instance = this.componentRef.instance;
      // TODO make sure widget id is not changed
      // TODO widget id change should trigger a form rebuild
      instance.label = button.label;
      if (typeof button.widget !== 'string') {
        Object.assign(instance.widget, button.widget);
      }

      Object.assign(instance.options, button.options);
      // TODO dont rebuild if there is no changes
      // rebuild action in case onInvalidProperty changed
      instance.action = this.getButtonAction(instance);

      this.componentRef.changeDetectorRef.detectChanges();
    });
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

    // update instance options, with schema options
    Object.assign(instance.options, this.button.options);

    // after widget has been merged with defaults
    instance.action = this.getButtonAction(instance);

    // react to templateSchema button changes
    this.bindTemplateChanges();
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
