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
  WidgetLayout,
  ControlWidget,
  ArrayLayoutWidget,
  ObjectLayoutWidget,
  FieldsetLayoutWidget,
  ButtonLayoutWidget
} from './lib/widget';

export { ArrayWidget } from './lib/defaultwidgets/array/array.widget';
export { ButtonWidget } from './lib/defaultwidgets/button/button.widget';
export { ObjectWidget } from './lib/defaultwidgets/object/object.widget';
export { CheckboxWidget } from './lib/defaultwidgets/checkbox/checkbox.widget';
export { FileWidget } from './lib/defaultwidgets/file/file.widget';
export { IntegerWidget } from './lib/defaultwidgets/integer/integer.widget';
export { TextAreaWidget } from './lib/defaultwidgets/textarea/textarea.widget';
export { RadioWidget } from './lib/defaultwidgets/radio/radio.widget';
export { RangeWidget } from './lib/defaultwidgets/range/range.widget';
export { SelectWidget } from './lib/defaultwidgets/select/select.widget';
export { StringWidget } from './lib/defaultwidgets/string/string.widget';
export { FieldsetWidget } from './lib/defaultwidgets/fieldset/fieldset.widget';
export { TabsWidget } from './lib/defaultwidgets/tabs/tabs.widget';
export {
  DefaultWidgetRegistry
} from './lib/defaultwidgets/defaultwidgetregistry';

export { SchemaFormModule } from './lib/schema-form.module';
export {
  TemplateSchemaModule
} from './lib/template-schema/template-schema.module';
