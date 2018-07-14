import { EventEmitter } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, startWith  } from 'rxjs/operators';

import { FormProperty } from './form-property';
import { FormPropertyErrors } from './form-property-errors';
import { Schema, SchemaValidatorFn } from '../schema';


type Constructor<T> = new (...args: any[]) => T;

export function ControlProperty<T extends Constructor<AbstractControl>>(Base: T) {
  abstract class Property extends Base implements FormProperty {
    nonEmptyValue: any;
    nonEmptyValueChanges = new EventEmitter();
    visibilityChanges = new BehaviorSubject<boolean>(true);

    get id(): string {
      return this.path.toLowerCase()
        .slice(1)
        .replace('/*', '')
        .split('/')
        .join('.');
    }

    get isRoot(): boolean {
      return this === this.root;
    }

    protected _path: string;
    get path(): string {
      return this._path;
    }

    protected _schema: Schema;
    get schema(): Schema {
      return this._schema;
    }

    protected _visible = true;
    get visible(): boolean {
      return this._visible;
    }

    constructor(...args: any[]) {
      super(...args);

    }

    getErrors(): FormPropertyErrors | null {
      const errors = this.errors;

      if (!errors) {
        return null;
      }

      return new FormPropertyErrors({ [this.path]: errors });
    }

    setVisible(visible: boolean, opts = { disable: false }) {
      this._visible = visible;
      if (opts.disable) {
        if (this.visible) {
          this.enable();
        } else {
          this.disable();
        }
      }
      this.visibilityChanges.next(this.visible);
    }

    setSchemaValidator(validate: SchemaValidatorFn) {

      // TODO unsubscribe
      this.valueChanges
        .subscribe(() => {
          const value = this.nonEmptyValue;
          this.nonEmptyValueChanges.emit(value);

          if (this.pristine) {
            return;
          }

          const errors = validate(value);
          if (!errors) {
            return;
          }

          Object.keys(errors).forEach((path: string) => {
            const control = this.get(path);
            if (control) {
              control.setErrors(errors[path], { emitEvent: true });
            }
          });
        });
    }

    // visible if AT LEAST ONE of the properties it depends on is visible
    // AND has a value in the list
    bindVisibility() {
      // SHOULD ONLY BE CALLED AFTER ENTIRE PROPERTY TREE IS BUILT
      const visibleIf = this.schema.visibleIf;

      if (visibleIf === undefined) {
        return;
      }

      const paths = Object.keys(visibleIf);
      if (typeof visibleIf === 'object' && paths.length === 0) {
        this.setVisible(false);
        return;
      }

      const observables = [];
      for (const path of paths) {
        if (!visibleIf.hasOwnProperty(path)) {
          continue;
        }

        const property = this.root.get(path);
        if (!property) {
          console.warn(
            `Couldn't find property ${path} for visibility check of ` + this.path
          );
          continue;
        }

        const values = visibleIf[path];

        const observable = property.valueChanges.pipe(
          startWith(values.includes(property.value)),
          map((value) => {
            return values.includes('$ANY$') || values.includes(value);
          })
        );

        observables.push(observable);
      }

      // TODO unsubscribe
      combineLatest(observables)
        .subscribe((values: boolean[]) => {
          this.setVisible(values.includes(true));
        });

    }

    get(path: Array<string|number>|string): AbstractControl|null {
      if (typeof path === 'string' && path.includes('/')) {
        path = this.normalizePath(path);
      }
      return super.get(path);
    }

    private normalizePath(path: string): string[] {
      if (path[0] === '/') {
        path = path.slice(1);
      }
      return path.split('/');
    }

  }

  return Property;

}


