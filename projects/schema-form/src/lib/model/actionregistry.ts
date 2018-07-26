import { Action } from './action';
import { ButtonComponent} from '../template-schema/button/button.component';

// TODO rethink ref button component, ActionRegistry is doing more than it should
export class ActionRegistry {
  actions: {[key: string]: {action: Action, field?: ButtonComponent} } = {};

  clear() {
    this.actions = {};
  }

  register(actionId: string, action: Action, field?: ButtonComponent) {
    this.actions[actionId] = { action, field };
  }

  get(actionId: string): { action: Action, field?: ButtonComponent } {
    return this.actions[actionId];
  }
}
