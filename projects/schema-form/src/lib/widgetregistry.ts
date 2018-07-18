
export enum WidgetType {
  Field = 'field',
  Fieldset = 'fieldset'
}

export class WidgetRegistry {

  private widgets: { [type: string]: { [id: string]: any } } = {};

  private defaultWidget: { [type: string]: any } = {};

  setDefaultWidget(widget: any, type = WidgetType.Field) {
    this.defaultWidget[type] = widget;
  }

  getDefaultWidget(type = WidgetType.Field) {
    return this.defaultWidget[type];
  }

  hasWidget(id: string, type = WidgetType.Field) {
    if (!this.widgets.hasOwnProperty(type)) {
      return false;
    }
    return this.widgets[type].hasOwnProperty(id);
  }

  register(id: string, widget: any, type = WidgetType.Field) {
    if (!this.widgets.hasOwnProperty(type)) {
      this.widgets[type] = {};
    }
    this.widgets[type][id] = widget;
  }

  getWidgetType(id: string, type = WidgetType.Field): any {
    if (this.hasWidget(id, type)) {
      return this.widgets[type][id];
    }
    return this.getDefaultWidget(type);
  }
}
