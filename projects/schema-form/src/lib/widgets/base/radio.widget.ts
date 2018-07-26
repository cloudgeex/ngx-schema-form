import { PropertyWidget, Widget } from './widget';

export abstract class RadioWidget<T extends Widget = Widget>
  extends PropertyWidget<T> { }
