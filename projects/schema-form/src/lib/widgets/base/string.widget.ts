import { PropertyWidget } from '../../widget';

export abstract class StringWidget extends PropertyWidget {

  getInputType(): string {
    if (!this.schema.widget.id || this.schema.widget.id === 'string') {
      return 'text';
    }

    return this.schema.widget.id;
  }

}
