import { ObjectPropertyWidget, Widget } from './widget';

export abstract class ObjectWidget<T extends Widget = Widget>
extends ObjectPropertyWidget<T> { }
