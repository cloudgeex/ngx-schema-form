import {
  Component,
  ComponentRef,
  Input,
  OnChanges,
  ViewChild,
  ViewContainerRef,
  OnInit,
  OnDestroy
} from '@angular/core';
import { Subscription } from 'rxjs';

import { WidgetFactory } from '../widgetfactory';
import { TerminatorService } from '../terminator.service';

@Component({
  selector: 'sf-form-element-action',
  template: '<ng-template #target></ng-template>'
})
export class FormElementActionComponent implements OnInit, OnChanges, OnDestroy {

  @Input()
  button: any;

  @Input()
  formProperty: any;

  @ViewChild('target', {read: ViewContainerRef}) container: ViewContainerRef;

  private ref: ComponentRef<any>;
  private subs: Subscription;

  constructor(private widgetFactory: WidgetFactory = null,
              private terminator: TerminatorService) {
  }

  ngOnInit() {
    this.subs = this.terminator.destroyed.subscribe(() => {
      this.ref.destroy();
    });
  }

  getWidgetId(): string {
    if (!this.button.widget || !this.button.widget.id) {
      return 'button';
    }

    return this.button.widget.id;
  }

  ngOnChanges() {
    this.ref = this.widgetFactory.createWidget(
      this.container,
      this.getWidgetId()
    );
    this.ref.instance.button = this.button;
    this.ref.instance.formProperty = this.formProperty;
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
