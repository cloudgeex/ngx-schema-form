import { EventEmitter } from '@angular/core';

export class TerminatorService {

  public destroyed = new EventEmitter();


  destroy() {
    this.destroyed.emit();
  }
}
