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
    const widgetId = this.getFieldsetWidgetId();
    this.componentRef = this.widgetFactory.createWidget(
      this.viewContainerRef,
      widgetId,
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
    component.widget = this.fieldset.widget;

  }

  destroyComponentRef() {
    this.componentRef.destroy();
    this.viewContainerRef.clear();
  }

  ngOnDestroy() {
    this.destroyComponentRef();
  }

  private getFieldsetWidgetId(): string {
    if (!this.fieldset.widget) {
      return;
    }

    if (typeof this.fieldset.widget === 'string') {
      return this.fieldset.widget;
    }

    return this.fieldset.widget.id;
  }


}
