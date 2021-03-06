import {
  Directive,
  ComponentRef,
  Input,
  ViewContainerRef,
  OnInit,
  OnDestroy,
  TemplateRef,
  Injector,
} from '@angular/core';

import { WidgetFactory } from '../widgetfactory';
import { WidgetType } from '../widgetregistry';
import { FieldsetWidget } from '../widgets/base/fieldset.widget';
import { FormProperty } from '../model/form-property';
import { GenericProperty } from '../model/generic-property';
import { ObjectProperty } from '../model/object-property';

import { FormElementTemplateRef } from './form-element.component';

@Directive({
  selector: '[sfFormFieldsetWidgetChooser]',
})
export class FormFieldsetWidgetChooserDirective implements OnInit, OnDestroy {

  @Input()
  formProperty: ObjectProperty;

  @Input()
  fieldset: any;

  @Input()
  templateRef: TemplateRef<any>;

  private componentRef: ComponentRef<FieldsetWidget>;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private widgetFactory: WidgetFactory
  ) { }

  ngOnInit() {

    const injector = Injector.create({
      providers: [{
        provide: FormElementTemplateRef,
        useValue: this.templateRef,
      }],
    });

    const widget = this.getFieldsetWidget();
    this.componentRef = this.widgetFactory.createWidget<FieldsetWidget>(
      this.viewContainerRef,
      widget.id,
      {
        type: WidgetType.Fieldset,
        injector
      }
    );

    const component = this.componentRef.instance;
    component.formProperty = this.formProperty;
    component.title = this.fieldset.title;
    component.description = this.fieldset.description;
    component.formProperties = this.fieldset.fields.map((id) => {
      return this.formProperty.get(id);
    });

    component.widget = widget;

    this.formProperty.fieldsetWidgetInstance = component;

  }

  ngOnDestroy() {
    this.componentRef.destroy();
    this.viewContainerRef.clear();
  }

  private getFieldsetWidget(): any {
    if (!this.fieldset.widget) {
      return { id: 'fieldset' };
    }

    if (typeof this.fieldset.widget === 'string') {
      return { id: this.fieldset.widget };
    }

    if (!this.fieldset.widget.id) {
      this.fieldset.widget.id = 'fieldset';
    }

    return this.fieldset.widget;
  }


}
