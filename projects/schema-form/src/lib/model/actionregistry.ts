import { Action } from './action';

export class ActionRegistry {
  actions: { [key: string]: Action } = {};

  clear(): void {
    this.actions = {};
  }

  register(actionId: string, action: Action): void {
    this.actions[actionId] = action;
  }

  get(actionId: string): Action {
    return this.actions[actionId];
  }
}
