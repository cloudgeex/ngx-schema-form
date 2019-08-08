import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  InjectionToken,
  ChangeDetectionStrategy,
  ViewEncapsulation, OnDestroy, Renderer2, ElementRef
} from '@angular/core';
import { FormControl } from '@angular/forms';

import { ActionRegistry } from '../model/actionregistry';
import { FormProperty } from '../model/form-property';
import { BindingRegistry } from '../model/bindingregistry';
import { Binding } from '../model/binding';
import { Function } from 'estree';

export abstract class FormElementTemplateRef extends TemplateRef<any> {
}

// TODO move has-error/success classes to fieldset
@Component({
  selector: 'sf-form-element',
  template: `
    <div *ngIf="formProperty.visible && formProperty.schema.widget?.id !== 'none'"
         [class.has-error]="!formProperty.hasOwnProperty('controls') && !formProperty.valid"
         [class.has-success]="!formProperty.hasOwnProperty('controls') && formProperty.valid">
      <ng-template sfFormPropertyWidgetChooser [formProperty]="formProperty"></ng-template>
      <ng-container *ngIf="formProperty.schema.buttons as buttons">
        <div class="button-container">
          <ng-template sfFormButtonWidgetChooser
                       *ngFor="let button of buttons"
                       [button]="button"
                       [formProperty]="formProperty">
          </ng-template>
        </div>
      </ng-container>
    </div>`,
  encapsulation: ViewEncapsulation.None,
  // TODO move to OnPush change detection strategy
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormElementComponent implements OnInit, OnDestroy {

  @Input()
  formProperty: FormProperty;
  unlisten = [];

  constructor(private actionRegistry: ActionRegistry,
              private bindingRegistry: BindingRegistry,
              private renderer: Renderer2,
              private elementRef: ElementRef) {
  }

  ngOnInit(): void {
    this.setupBindings();
  }

  private setupBindings() {
    const bindings: Binding[] = this.bindingRegistry.get(this.formProperty.path);
    if ((bindings || []).length) {
      bindings.forEach((binding) => {
        for (const eventId in binding) {
          this.createBinding(eventId, binding[eventId]);
        }
      });
    }
  }

  private createBinding(eventId, listener) {
    this.unlisten.push(this.renderer.listen(this.elementRef.nativeElement,
      eventId,
      (event) => {
        if (listener instanceof Function) {
          listener(event, this.formProperty);
        } else {
          console.warn('Calling non function handler for eventId ' + eventId + ' for path ' + this.formProperty.path);
        }
      }));
  }

  ngOnDestroy(): void {
    if (this.unlisten) {
      this.unlisten.forEach((item) => {
        item();
      });
    }
  }
}
