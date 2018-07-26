import { PropertyWidget, Widget } from './widget';

export abstract class StringWidget<T extends Widget = Widget>
extends PropertyWidget<T> {

  getInputType(): string {
    if (!this.schema.widget.id || this.schema.widget.id === 'string') {
      return 'text';
    }

    return this.schema.widget.id;
  }

}
