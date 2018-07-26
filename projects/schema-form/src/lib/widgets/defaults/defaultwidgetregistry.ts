import { ArrayComponent } from './array/array.component';
import { ButtonComponent } from './button/button.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { FileComponent } from './file/file.component';
import { IntegerComponent } from './integer/integer.component';
import { ObjectComponent } from './object/object.component';
import { RadioComponent } from './radio/radio.component';
import { RangeComponent } from './range/range.component';
import { SelectComponent } from './select/select.component';
import { StringComponent } from './string/string.component';
import { TextAreaComponent } from './textarea/textarea.component';
import { FieldsetComponent } from './fieldset/fieldset.component';
import { TabsComponent } from './tabs/tabs.component';

import { WidgetRegistry, WidgetType } from '../../widgetregistry';

export class DefaultWidgetRegistry extends WidgetRegistry {
  constructor() {
    super();

    // fieldsets
    this.setDefaultWidget(FieldsetComponent, WidgetType.Fieldset);
    this.register('fieldset', FieldsetComponent, WidgetType.Fieldset);
    this.register('tabs', TabsComponent, WidgetType.Fieldset);

    // buttons
    this.setDefaultWidget(ButtonComponent, WidgetType.Button);
    this.register('button', ButtonComponent, WidgetType.Button);

    // properties
    this.setDefaultWidget(StringComponent);
    this.register('array',  ArrayComponent);
    this.register('object',  ObjectComponent);
    this.register('string', StringComponent);
    this.register('search', StringComponent);
    this.register('tel', StringComponent);
    this.register('url', StringComponent);
    this.register('email', StringComponent);
    this.register('password', StringComponent);
    this.register('color', StringComponent);
    this.register('date', StringComponent);
    this.register('date-time', StringComponent);
    this.register('time', StringComponent);
    this.register('integer', IntegerComponent);
    this.register('number', IntegerComponent);
    this.register('range', RangeComponent);
    this.register('textarea', TextAreaComponent);
    this.register('file', FileComponent);
    this.register('select', SelectComponent);
    this.register('radio', RadioComponent);
    this.register('boolean', CheckboxComponent);
    this.register('checkbox', CheckboxComponent);
  }
}
