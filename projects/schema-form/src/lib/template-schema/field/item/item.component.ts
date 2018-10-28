import {
 Component,
 ElementRef,
 Input,
 OnInit,
 forwardRef
} from '@angular/core';

import { TemplateSchemaElement } from '../../template-schema-element';


@Component({
  selector: 'sf-item',
  templateUrl: './item.component.html'
})
export class ItemComponent extends TemplateSchemaElement implements OnInit {

  @Input()
  value: any;

  @Input()
  label: string;

  description: string;

  constructor(private elementRef: ElementRef) {
    super();
  }

  ngOnInit() {
    // TODO use title instead
    //this.description = this.getTextContent(this.elementRef);
    this.description = this.label;
  }

}
