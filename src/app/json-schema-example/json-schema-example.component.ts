import {
  Component,
  ViewEncapsulation,
  OnInit,
  OnDestroy
} from '@angular/core';
import { WidgetRegistry } from 'ngx-schema-form';
import { Subscription } from 'rxjs';

import sampleSchema1 from './sampleschema.json';
import sampleSchema2 from './otherschema.json';
import sampleModel from './samplemodel.json';


import { AppService, AppData } from '../app.service';

@Component({
    selector: 'sf-json-schema-example',
    templateUrl: './json-schema-example.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class JsonSchemaExampleComponent implements OnInit, OnDestroy {
  schema: any = sampleSchema1;
  model: any = sampleModel;
  value: any;
  fieldValidators: { [fieldId: string]: any } = {};
  actions = {};
  schemaUrl: string;

  private subs: Subscription;


  constructor(
    registry: WidgetRegistry,
    private appService: AppService
  ) { }


  ngOnInit() {

    this.subs = this.appService.dataChanged
      .subscribe((data: AppData | null) => {
        if (data) {
          this.schema = data.schema;
          return;
        }

        this.schema = sampleSchema1;
      });

  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  changeSchema() {
    this.schema = sampleSchema2;
  }


}
