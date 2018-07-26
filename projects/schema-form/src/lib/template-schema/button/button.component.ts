import {
  Component,
  AfterContentInit,
  Input,
  Output,
  ElementRef,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { Subject } from 'rxjs';

import { TemplateSchemaElement } from '../template-schema-element';
import { ButtonWidgetOptions } from '../../widgets/base/button.widget';


@Component({
  selector: 'sf-button',
  templateUrl: './button.component.html',
})
export class ButtonComponent extends TemplateSchemaElement implements OnChanges, AfterContentInit {

  @Input()
  id: string;

  @Input()
  label = '';

  @Input()
  options = new ButtonWidgetOptions();

  @Input()
  widget: string | object;

  @Output()
  click = new EventEmitter<any>();

  changes = new EventEmitter<any>();

  constructor(private elementRef: ElementRef) {
    super();
  }

  private setLabelFromContent() {
    const textContent = this.getTextContent(this.elementRef);

    // label as @Input takes priority over content text
    if (textContent && !this.label) {
      this.label = textContent;
    }

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.label || changes.widget) {
      this.changes.emit({ label: this.label, widget: this.widget });
    }
  }

  ngAfterContentInit() {
    this.setLabelFromContent();
  }

}
