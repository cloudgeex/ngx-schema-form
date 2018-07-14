import { ValidationErrors } from '@angular/forms';

export class FormPropertyErrors  {

  readonly errors: { [path: string]: ValidationErrors };

  constructor(errors: { [path: string]: ValidationErrors }) {
    this.errors = errors;
  }

  getMessages(): string[] {
    const errorsPaths = Object.keys(this.errors);

    if (!errorsPaths.length) {
      return [];
    }

    return errorsPaths
      .reduce((messages: string[], path: string) => {
        const message = this.errors[path].message;
        if (!message) {
          messages.push(
            'Missing validation error "message" for property ' + path
          );
          return messages;
        }

        messages.push(message);
        return messages;
      }, []);
  }

}
