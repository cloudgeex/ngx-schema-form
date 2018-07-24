import {
  ViewContainerRef,
  ComponentRef,
  ComponentFactoryResolver,
  Injectable,
  Injector
} from '@angular/core';

import { WidgetRegistry, WidgetType } from './widgetregistry';
import { Widget } from './widget';

@Injectable()
export class WidgetFactory {

  constructor(
    private widgetRegistry: WidgetRegistry,
    private factoryResolver: ComponentFactoryResolver
  ) { }

  createWidget<T = Widget<any>>(
    container: ViewContainerRef,
    id: string,
    opts: {
      type: WidgetType,
      injector?: Injector
    } = {
      type: WidgetType.Field
    }
  ): ComponentRef<T> {

    const componentClass = this.widgetRegistry.getWidgetType(id, opts.type);
    const componentFactory = this.factoryResolver
      .resolveComponentFactory<T>(componentClass);

    return container.createComponent(
      componentFactory,
      undefined, // index
      opts.injector
    );
  }
}
