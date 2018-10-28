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
import { ArrayComponent } from './widgets/defaults/array/array.component';
import { ButtonComponent } from './widgets/defaults/button/button.component';
import { ObjectComponent } from './widgets/defaults/object/object.component';
import { CheckboxComponent } from './widgets/defaults/checkbox/checkbox.component';
import { FileComponent } from './widgets/defaults/file/file.component';
import { IntegerComponent } from './widgets/defaults/integer/integer.component';
import { TextAreaComponent } from './widgets/defaults/textarea/textarea.component';
import { RadioComponent } from './widgets/defaults/radio/radio.component';
import { RangeComponent } from './widgets/defaults/range/range.component';
import { SelectComponent } from './widgets/defaults/select/select.component';
import { StringComponent } from './widgets/defaults/string/string.component';
import { FieldsetComponent } from './widgets/defaults/fieldset/fieldset.component';
import { TabsComponent } from './widgets/defaults/tabs/tabs.component';
import { DefaultWidgetRegistry } from './widgets/defaults/defaultwidgetregistry';
import { DefaultWidget } from './default.widget';

import { WidgetRegistry } from './widgetregistry';
import { SchemaValidatorFactory } from './schemavalidatorfactory';
import { AjvSchemaValidatorFactory } from './ajv-schema-validator-factory';

export const moduleProviders = [
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
    ArrayComponent,
    ButtonComponent,
    ObjectComponent,
    CheckboxComponent,
    FileComponent,
    IntegerComponent,
    TextAreaComponent,
    RadioComponent,
    RangeComponent,
    SelectComponent,
    StringComponent,
    FieldsetComponent,
    FormFieldComponent,
    TabsComponent
  ],
  entryComponents: [
    FormElementComponent,
    FormComponent,
    FormFieldComponent,
    ArrayComponent,
    ButtonComponent,
    ObjectComponent,
    CheckboxComponent,
    FileComponent,
    IntegerComponent,
    TextAreaComponent,
    RadioComponent,
    RangeComponent,
    SelectComponent,
    StringComponent,
    FieldsetComponent,
    TabsComponent
  ],
  exports: [
    FormComponent,
    FormElementComponent,
    FormButtonWidgetChooserDirective,
    FormFieldComponent,
    FormPropertyWidgetChooserDirective,
    ArrayComponent,
    ButtonComponent,
    ObjectComponent,
    CheckboxComponent,
    FileComponent,
    IntegerComponent,
    TextAreaComponent,
    RadioComponent,
    RangeComponent,
    SelectComponent,
    StringComponent,
    FieldsetComponent,
    FormFieldsetWidgetChooserDirective,
    TabsComponent
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
