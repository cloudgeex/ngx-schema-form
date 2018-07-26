/*
 * Public API Surface of schema-form
 */

// TODO cleanup external api
export { FormComponent } from './lib/form/form.component';
export { FormElementComponent } from './lib/form/form-element.component';
export {
  FormButtonWidgetChooserDirective
} from './lib/form/form-button-widget-chooser.directive';
export { FormFieldComponent } from './lib/form/form-field.component';
export {
  FormFieldsetWidgetChooserDirective
} from './lib/form/form-fieldset-widget-chooser.directive';
export {
  FormPropertyWidgetChooserDirective
} from './lib/form/form-property-widget-chooser.directive';
export { WidgetRegistry, WidgetType } from './lib/widgetregistry';
export { SchemaValidatorFactory } from './lib/schemavalidatorfactory';
export { ZSchemaValidatorFactory } from './lib/z-schema-validator-factory';
export { AjvSchemaValidatorFactory } from './lib/ajv-schema-validator-factory';
export {
  Widget,
  PropertyWidget,
  ArrayPropertyWidget,
  ObjectPropertyWidget,
  FieldsetLayoutWidget,
} from './lib/widget';

export { ArrayWidget } from './lib/widgets/base/array.widget';
export { ButtonWidget } from './lib/widgets/base/button.widget';
export { ObjectWidget } from './lib/widgets/base/object.widget';
export { CheckboxWidget } from './lib/widgets/base/checkbox.widget';
export { FileWidget } from './lib/widgets/base/file.widget';
export { IntegerWidget } from './lib/widgets/base/integer.widget';
export { TextAreaWidget } from './lib/widgets/base/textarea.widget';
export { RadioWidget } from './lib/widgets/base/radio.widget';
export { RangeWidget } from './lib/widgets/base/range.widget';
export { SelectWidget } from './lib/widgets/base/select.widget';
export { StringWidget } from './lib/widgets/base/string.widget';
export { FieldsetWidget } from './lib/widgets/base/fieldset.widget';

export { ArrayComponent } from './lib/widgets/defaults/array/array.component';
export { ButtonComponent } from './lib/widgets/defaults/button/button.component';
export { ObjectComponent } from './lib/widgets/defaults/object/object.component';
export { CheckboxComponent } from './lib/widgets/defaults/checkbox/checkbox.component';
export { FileComponent } from './lib/widgets/defaults/file/file.component';
export { IntegerComponent } from './lib/widgets/defaults/integer/integer.component';
export { TextAreaComponent } from './lib/widgets/defaults/textarea/textarea.component';
export { RadioComponent } from './lib/widgets/defaults/radio/radio.component';
export { RangeComponent } from './lib/widgets/defaults/range/range.component';
export { SelectComponent } from './lib/widgets/defaults/select/select.component';
export { StringComponent } from './lib/widgets/defaults/string/string.component';
export { FieldsetComponent } from './lib/widgets/defaults/fieldset/fieldset.component';
export { TabsComponent } from './lib/widgets/defaults/tabs/tabs.component';
export {
  DefaultWidgetRegistry
} from './lib/widgets/defaults/defaultwidgetregistry';

export { SchemaFormModule } from './lib/schema-form.module';
export {
  TemplateSchemaModule
} from './lib/template-schema/template-schema.module';
