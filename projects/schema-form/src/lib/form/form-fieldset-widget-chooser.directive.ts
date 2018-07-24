import {
  Directive,
  ComponentRef,
  Input,
  ViewContainerRef,
  OnInit,
  OnDestroy,
  OnChanges,
  TemplateRef,
  Injector,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { TerminatorService } from '../terminator.service';
import { WidgetFactory } from '../widgetfactory';
import { WidgetType } from '../widgetregistry';
import { FieldsetLayoutWidget } from '../widget';
import { FormProperty } from '../model/form-property';
import { GenericProperty } from '../model/generic-property';
import { ObjectProperty } from '../model/object-property';

import { FormElementTemplateRef } from './form-element.component';

@Directive({
  selector: '[sfFieldsetWidgetChooser]',
})
export class FieldsetWidgetChooserDirective implements OnInit, OnDestroy, OnChanges {

  @Input()
  formProperty: ObjectProperty;

  @Input()
  fieldset: any;

  @Input()
  templateRef: TemplateRef<any>;


  private componentRef: ComponentRef<any>;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private widgetFactory: WidgetFactory = null,
    private terminator: TerminatorService,
  ) { }

  ngOnInit() {

    this.terminator.destroyed
      .pipe(take(1))
      .subscribe(() => {
        this.destroyComponentRef();
      });

  }

  ngOnChanges() {
    const injector = Injector.create({
      providers: [{
        provide: FormElementTemplateRef,
        useValue: this.templateRef,
      }],
    });
    const widget = this.getFieldsetWidget();
    this.componentRef = this.widgetFactory.createWidget(
      this.viewContainerRef,
      widget.id,
      {
        type: WidgetType.Fieldset,
        injector
      }
    );

    const component = <FieldsetLayoutWidget>this.componentRef.instance;
    component.formProperty = this.formProperty;
    component.title = this.fieldset.title;
    component.description = this.fieldset.description;
    component.formProperties = this.fieldset.fields.map((id) => {
      return this.formProperty.get(id);
    });

    component.widget = widget;

    this.formProperty.fieldsetWidgetInstance = component;

  }

  destroyComponentRef() {
    this.componentRef.destroy();
    this.viewContainerRef.clear();
  }

  ngOnDestroy() {
    this.destroyComponentRef();
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
