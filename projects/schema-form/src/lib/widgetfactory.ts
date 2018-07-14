import {
  ViewContainerRef,
  ComponentRef,
  ComponentFactoryResolver,
  Injectable
} from '@angular/core';

import { WidgetRegistry } from './widgetregistry';
import { Widget } from './widget';

@Injectable()
export class WidgetFactory {

  private resolver: ComponentFactoryResolver;
  private registry: WidgetRegistry;

  constructor(registry: WidgetRegistry, resolver: ComponentFactoryResolver) {
    this.registry = registry;
    this.resolver = resolver;
  }

  createWidget(container: ViewContainerRef, type: string): ComponentRef<Widget<any>> {
    const componentClass = this.registry.getWidgetType(type);

    const componentFactory = this.resolver.resolveComponentFactory<Widget<any>>(componentClass);
    return container.createComponent(componentFactory);
  }
}
