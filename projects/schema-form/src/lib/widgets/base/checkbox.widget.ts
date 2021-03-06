import { OnInit } from '@angular/core';

import { PropertyWidget, Widget } from './widget';

export abstract class CheckboxWidget<T extends Widget = Widget>
extends PropertyWidget<T> implements OnInit {

  checked: { [key: string]: boolean } = {};

  ngOnInit() {
    if (this.schema.type === 'array') {
      this.formProperty.valueChanges.subscribe((values: any[]) => {

        values.forEach((value: any) => {
          if (!this.checked[value]) {
            this.checked[value] = true;
          }
        });

      });
    }
  }

  check(checked: boolean, value: any) {
    if (checked) {
      this.checked[value] = true;
    } else {
      delete this.checked[value];
    }

    this.formProperty.patchValue(
      Object.keys(this.checked).filter((key) => this.checked[key])
    );
  }
}
