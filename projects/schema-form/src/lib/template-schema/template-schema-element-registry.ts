import { FieldComponent } from './field/field.component';

export enum TemplateElementType {
  Field = 'field',
  Button = 'button'
}

export class TemplateSchemaElementRegistry {

  private elements: { [type: string]: { [id: string]: any } } = {};

  hasElement(id: string, type = TemplateElementType.Field) {
    if (!this.elements.hasOwnProperty(type)) {
      return false;
    }
    return this.elements[type].hasOwnProperty(id);
  }

  register(id: string, element: any, type = TemplateElementType.Field) {
    if (!this.elements.hasOwnProperty(type)) {
      this.elements[type] = {};
    }
    this.elements[type][id] = element;
  }

  getElement<T = FieldComponent>(id: string, type = TemplateElementType.Field): T {
    if (this.hasElement(id, type)) {
      return this.elements[type][id];
    }
  }

  clear(): void {
    this.elements = {};
  }
}
