import {
  Directive,
  ContentChildren,
  QueryList,
  AfterContentInit,
  HostBinding,
  SimpleChange,
  SimpleChanges,
  Input
} from '@angular/core';
import { merge } from 'rxjs';

import { FormComponent } from '../form/form.component';
import { ActionRegistry } from '../model/actionregistry';
import { ValidatorRegistry } from '../model/validatorregistry';
import { TerminatorService } from '../terminator.service';
import { SchemaPropertyType } from '../schema';

import { TemplateSchemaService } from './template-schema.service';
import { FieldComponent } from './field/field.component';
import { Field } from './field/field';
import { ButtonComponent } from './button/button.component';
import { FieldParent } from './field/field-parent';


@Directive({
  selector: 'sf-form[templateSchema]',
  providers: [
    TemplateSchemaService
  ]
})
export class TemplateSchemaDirective extends FieldParent implements AfterContentInit {

  @ContentChildren(FieldComponent)
  childFields: QueryList<FieldComponent>;

  @ContentChildren(ButtonComponent)
  childButtons: QueryList<ButtonComponent>;

  @Input()
  fieldsets: { [key: string]: any }[];

  constructor(
    protected actionRegistry: ActionRegistry,
    protected validatorRegistry: ValidatorRegistry,
    private formComponent: FormComponent,
    private terminatorService: TerminatorService,
    private templateSchemaService: TemplateSchemaService
  ) {
    super();
  }

  setFormDocumentSchema(fields: FieldComponent[]) {
    this.actionRegistry.clear();
    this.validatorRegistry.clear();

    const schema = this.getFieldsSchema(fields);

    const _validators = this.getFieldsValidators(fields);
    _validators.forEach(({ path, validators }) => {
      this.validatorRegistry.register(path, validators);
    });

    const previousSchema = this.formComponent.schema;
    this.formComponent.schema = {
      type: SchemaPropertyType.Object,
      properties: schema.properties
    };

    if (this.fieldsets) {
      this.formComponent.schema.fieldsets = this.fieldsets;
    }

    if (schema.required && schema.required.length > 0) {
      this.formComponent.schema.required = schema.required;
    }

    const buttons = this.getButtons();
    if (buttons.length > 0) {
      this.formComponent.schema.buttons = buttons;
    }

    this.formComponent.ngOnChanges({
      schema: new SimpleChange(
        previousSchema,
        this.formComponent.schema,
        Boolean(previousSchema)
      )
    });

  }


  ngAfterContentInit() {

    if (this.childFields.length > 0) {
      this.setFormDocumentSchema(this.childFields.toArray());
    }

    merge(
      this.childFields.changes,
      this.templateSchemaService.changes
    )
   .subscribe(() => {
      this.terminatorService.destroy();
      this.setFormDocumentSchema(this.childFields.toArray());
    });

  }

}
