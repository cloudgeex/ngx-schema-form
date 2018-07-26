import { Injectable, EventEmitter } from '@angular/core';

export class TemplateSchemaService {

  changes = new EventEmitter<boolean>();

  constructor() { }

  changed() {
    this.changes.emit(true);
  }

}
