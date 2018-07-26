import { ArrayPropertyWidget } from './widget';

export abstract class ArrayWidget extends ArrayPropertyWidget {


  addItem() {
    this.formProperty.addProperty();
  }

  removeItem(index: number) {
    this.formProperty.removeAt(index);
  }

}
