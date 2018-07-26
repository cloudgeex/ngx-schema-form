import { ArrayLayoutWidget } from '../../widget';

export abstract class ArrayWidget extends ArrayLayoutWidget {


  addItem() {
    this.formProperty.addProperty();
  }

  removeItem(index: number) {
    this.formProperty.removeAt(index);
  }

}
