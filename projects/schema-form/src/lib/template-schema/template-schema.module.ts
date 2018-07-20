import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FieldComponent } from './field/field.component';
import { TemplateSchemaDirective } from './template-schema.directive';
import { TemplateSchemaService } from './template-schema.service';
import { ButtonComponent } from './button/button.component';
import { ItemComponent } from './field/item/item.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    TemplateSchemaDirective,
    FieldComponent,
    ButtonComponent,
    ItemComponent
  ],
  exports: [
    TemplateSchemaDirective,
    FieldComponent,
    ButtonComponent,
    ItemComponent
  ],
  providers: [
    TemplateSchemaService
  ]
})
export class TemplateSchemaModule { }
