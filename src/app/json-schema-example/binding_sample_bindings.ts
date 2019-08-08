import {FormProperty} from '../../../projects/schema-form/src/lib/model';

const myFormBindings = {
  '/name': [
    {
      'input': (event, formProperty: FormProperty) => {
        console.log('input event!', event.target, event, formProperty);
      }
    },
    {
      'click': (event, formProperty: FormProperty) => {
        console.log('Click event!', event.target, event, formProperty);
      }
    }
  ]
};

export default myFormBindings;
