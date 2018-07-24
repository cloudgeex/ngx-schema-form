import { FieldComponent } from './field.component';

export class FieldRegistry {

  private fields: { [propertyPath: string]: FieldComponent } = {};

  hasField(propertyPath: string): boolean {
    return this.fields.hasOwnProperty(propertyPath);
  }

  register(propertyPath: string, field: FieldComponent): void {
    if (!this.fields.hasOwnProperty(propertyPath)) {
      this.fields[propertyPath] = field;
    }
  }

  getField(propertyPath: string): FieldComponent {
    if (this.hasField(propertyPath)) {
      return this.fields[propertyPath];
    }
  }
}
