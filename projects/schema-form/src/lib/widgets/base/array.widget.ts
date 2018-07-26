import { ArrayPropertyWidget, Widget } from './widget';

export abstract class ArrayWidget<T extends Widget = Widget> extends ArrayPropertyWidget<T> {


  addItem() {
    this.formProperty.addProperty();
  }

  removeItem(index: number) {
    this.formProperty.removeAt(index);
  }

}
