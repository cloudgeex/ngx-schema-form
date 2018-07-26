import { Component } from '@angular/core';

import { PropertyWidget, Widget } from './widget';

export abstract class RangeWidget<T extends Widget = Widget>
extends PropertyWidget<T> {}
