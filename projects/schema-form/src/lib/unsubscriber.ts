import { Subscription, Observable, Subject } from 'rxjs';

export function Unsubscriber() {
  return function (target, propertyKey) {

    const _propertyKey = '__' + propertyKey;

    Object.defineProperty(target, propertyKey, {
      get: function () {
        return this[_propertyKey];
      },
      set: function (subs: Subscription) {
        // replace anything the property holds with subscriptions list
        if (!this[_propertyKey]) {
          this[_propertyKey] = <Subscription[]>[];
        }
        this[_propertyKey].push(subs);
      },
      enumerable: true,
      configurable: true
    });

    const componentOnDestroy = target.ngOnDestroy;
    target.ngOnDestroy = function ngOnDestroy() {
      if (componentOnDestroy) {
        componentOnDestroy.call(target);
      }
      if (this[_propertyKey] && this[_propertyKey].length) {
        // unsubscribe to all subscriptions added to unsubscriber
        while (this[_propertyKey].length) {
          const subscription = this[_propertyKey].pop();
          if (subscription && subscription.unsubscribe) {
            subscription.unsubscribe();
          }
        }
        this[_propertyKey] = undefined;
      }
    };

  };
}
