import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FormElementComponent } from './form/form-element.component';
import { FormComponent } from './form/form.component';
import {
  FormPropertyWidgetChooserDirective
} from './form/form-property-widget-chooser.directive';
import {
  FormFieldsetWidgetChooserDirective
} from './form/form-fieldset-widget-chooser.directive';
import {
  FormButtonWidgetChooserDirective
} from './form/form-button-widget-chooser.directive';
import { FormFieldComponent } from './form/form-field.component';
import { ArrayWidget } from './defaultwidgets/array/array.widget';
import { ButtonWidget } from './defaultwidgets/button/button.widget';
import { ObjectWidget } from './defaultwidgets/object/object.widget';
import { CheckboxWidget } from './defaultwidgets/checkbox/checkbox.widget';
import { FileWidget } from './defaultwidgets/file/file.widget';
import { IntegerWidget } from './defaultwidgets/integer/integer.widget';
import { TextAreaWidget } from './defaultwidgets/textarea/textarea.widget';
import { RadioWidget } from './defaultwidgets/radio/radio.widget';
import { RangeWidget } from './defaultwidgets/range/range.widget';
import { SelectWidget } from './defaultwidgets/select/select.widget';
import { StringWidget } from './defaultwidgets/string/string.widget';
import { FieldsetWidget } from './defaultwidgets/fieldset/fieldset.widget';
import { TabsWidget } from './defaultwidgets/tabs/tabs.widget';
import { DefaultWidgetRegistry } from './defaultwidgets/defaultwidgetregistry';
import { DefaultWidget } from './default.widget';

import { WidgetRegistry } from './widgetregistry';
import { SchemaValidatorFactory } from './schemavalidatorfactory';
import { AjvSchemaValidatorFactory } from './ajv-schema-validator-factory';

const moduleProviders = [
  {
    provide: WidgetRegistry,
    useClass: DefaultWidgetRegistry
  },
  {
    provide: SchemaValidatorFactory,
    useClass: AjvSchemaValidatorFactory
  }
];

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  declarations: [
    FormElementComponent,
    FormButtonWidgetChooserDirective,
    FormComponent,
    FormPropertyWidgetChooserDirective,
    FormFieldsetWidgetChooserDirective,
    DefaultWidget,
    ArrayWidget,
    ButtonWidget,
    ObjectWidget,
    CheckboxWidget,
    FileWidget,
    IntegerWidget,
    TextAreaWidget,
    RadioWidget,
    RangeWidget,
    SelectWidget,
    StringWidget,
    FieldsetWidget,
    FormFieldComponent,
    TabsWidget
  ],
  entryComponents: [
    FormElementComponent,
    FormComponent,
    FormFieldComponent,
    ArrayWidget,
    ButtonWidget,
    ObjectWidget,
    CheckboxWidget,
    FileWidget,
    IntegerWidget,
    TextAreaWidget,
    RadioWidget,
    RangeWidget,
    SelectWidget,
    StringWidget,
    FieldsetWidget,
    TabsWidget
  ],
  exports: [
    FormComponent,
    FormElementComponent,
    FormButtonWidgetChooserDirective,
    FormFieldComponent,
    FormPropertyWidgetChooserDirective,
    ArrayWidget,
    ButtonWidget,
    ObjectWidget,
    CheckboxWidget,
    FileWidget,
    IntegerWidget,
    TextAreaWidget,
    RadioWidget,
    RangeWidget,
    SelectWidget,
    StringWidget,
    FieldsetWidget,
    FormFieldsetWidgetChooserDirective,
    TabsWidget
  ]
})
export class SchemaFormModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SchemaFormModule,
      providers: [...moduleProviders]
    };
  }
}
