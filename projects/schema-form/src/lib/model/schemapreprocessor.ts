import {isBlank} from './utils';

function formatMessage(message, path) {
  return `Parsing error on ${path}: ${message}`;
}

function schemaError(message, path): void {
  const mesg = formatMessage(message, path);
  throw new Error(mesg);
}

function schemaWarning(message, path): void {
  const mesg = formatMessage(message, path);
  throw new Error(mesg);
}

// TODO create error classes
export class SchemaPreprocessor {

  static preprocess(jsonSchema: any, path = '/'): any {
    jsonSchema = jsonSchema || {};
    if (jsonSchema.type === 'object') {
      SchemaPreprocessor.checkProperties(jsonSchema, path);
      SchemaPreprocessor.checkAndCreateFieldsets(jsonSchema, path);
    } else if (jsonSchema.type === 'array') {
      SchemaPreprocessor.checkItems(jsonSchema, path);
    }
    SchemaPreprocessor.normalizeWidget(jsonSchema);
    SchemaPreprocessor.recursiveCheck(jsonSchema, path);
  }

  private static checkProperties(jsonSchema, path: string) {
    if (isBlank(jsonSchema.properties)) {
      jsonSchema.properties = {};
      schemaWarning('Provided json schema does not contain a \'properties\' entry. Output schema will be empty', path);
    }
  }

  private static checkAndCreateFieldsets(jsonSchema: any, path: string) {
    if (jsonSchema.fieldsets === undefined) {
      if (jsonSchema.order !== undefined) {
        SchemaPreprocessor.replaceOrderByFieldsets(jsonSchema);
      } else {
        SchemaPreprocessor.createFieldsets(jsonSchema);
      }
    }
    SchemaPreprocessor.checkFieldsUsage(jsonSchema, path);
  }

  private static checkFieldsUsage(jsonSchema, path: string) {
    const fieldsId: string[] = Object.keys(jsonSchema.properties);
    const usedFields = {};
    for (const fieldset of jsonSchema.fieldsets) {
      for (const fieldId of fieldset.fields) {
        if (usedFields[fieldId] === undefined) {
          usedFields[fieldId] = [];
        }
        usedFields[fieldId].push(fieldset.id);
      }
    }

    for (const fieldId of fieldsId) {
      if (usedFields.hasOwnProperty(fieldId)) {
        if (usedFields[fieldId].length > 1) {
          schemaError(`${fieldId} is referenced by more than one fieldset: ${usedFields[fieldId]}`, path);
        }
        delete usedFields[fieldId];
      } else if (jsonSchema.required.indexOf(fieldId) > -1) {
        schemaError(`${fieldId} is a required field but it is not referenced as part of a 'order' or a 'fieldset' property`, path);
      } else {
        delete jsonSchema[fieldId];
        schemaWarning(`Removing unreferenced field ${fieldId}`, path);
      }
    }

    for (const remainingfieldsId in usedFields) {
      if (usedFields.hasOwnProperty(remainingfieldsId)) {
        schemaWarning(`Referencing non-existent field ${remainingfieldsId} in one or more fieldsets`, path);
      }
    }
  }

  private static createFieldsets(jsonSchema) {
    jsonSchema.order = Object.keys(jsonSchema.properties);
    SchemaPreprocessor.replaceOrderByFieldsets(jsonSchema);
  }

  private static replaceOrderByFieldsets(jsonSchema) {
    jsonSchema.fieldsets = [{
      id: 'fieldset-default',
      title: jsonSchema.title || '',
      description: jsonSchema.description || '',
      name: jsonSchema.name || '',
      fields: jsonSchema.order
    }];
    delete jsonSchema.order;
  }

  private static normalizeWidget(fieldSchema: any) {
    let widget = fieldSchema.widget;
    if (widget === undefined) {
      widget = {'id': fieldSchema.type};
    } else if (typeof widget === 'string') {
      widget = {'id': widget};
    }
    fieldSchema.widget = widget;
  }

  private static checkItems(jsonSchema, path) {
    if (jsonSchema.items === undefined) {
      schemaError('No \'items\' property in array', path);
    }
  }

  // TODO rename and remove unnecessary code according to change
  // TODO test, to make sure removal of recursion checks does not break anything
  private static recursiveCheck(jsonSchema, path: string) {
    if (jsonSchema.type === 'object') {
      for (const fieldId in jsonSchema.properties) {
        if (jsonSchema.properties.hasOwnProperty(fieldId)) {
          const fieldSchema = jsonSchema.properties[fieldId];
          // SchemaPreprocessor.preprocess(fieldSchema, path + fieldId + '/');
        }
      }
      if (jsonSchema.hasOwnProperty('definitions')) {
        for (const fieldId in jsonSchema.definitions) {
          if (jsonSchema.definitions.hasOwnProperty(fieldId)) {
            const fieldSchema = jsonSchema.definitions[fieldId];
            SchemaPreprocessor.removeRecursiveRefProperties(
              fieldSchema,
              `#/definitions/${fieldId}`
            );
            // formPropertyFactory recursive is used instead
            // SchemaPreprocessor.preprocess(fieldSchema, path + fieldId + '/');
          }
        }
      }
    } else if (jsonSchema.type === 'array') {
      // formPropertyFactory recursive is used instead
      // SchemaPreprocessor.preprocess(jsonSchema.items, path + '*/');
    }
  }

  private static removeRecursiveRefProperties(jsonSchema, definitionPath) {
    // to avoid infinite loop
    if (jsonSchema.type === 'object') {
      for (const fieldId in jsonSchema.properties) {
        if (jsonSchema.properties.hasOwnProperty(fieldId)) {
          if (jsonSchema.properties[fieldId].$ref
            && jsonSchema.properties[fieldId].$ref === definitionPath) {
            delete jsonSchema.properties[fieldId];
          } else if (jsonSchema.properties[fieldId].type === 'object') {
            SchemaPreprocessor.removeRecursiveRefProperties(
              jsonSchema.properties[fieldId],
              definitionPath
            );
          }
        }
      }
    }
  }
}

