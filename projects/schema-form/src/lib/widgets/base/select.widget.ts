import { PropertyWidget, Widget } from './widget';

export abstract class SelectWidget<T extends Widget = Widget>
extends PropertyWidget<T> { }
