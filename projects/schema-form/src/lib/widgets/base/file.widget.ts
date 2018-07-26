import { AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { PropertyWidget } from '../../widget';

export abstract class FileWidget extends PropertyWidget implements AfterViewInit {

  protected reader = new FileReader();
  protected filedata: any = {};
  fileName = new FormControl();

  ngAfterViewInit() {
    this.reader.onloadend = () => {
      this.filedata.data = btoa(this.reader.result);
      this.formProperty.setValue(this.filedata);
    };
  }

  onFileChange($event) {
    const file = $event.target.files[0];
    this.filedata.filename = file.name;
    this.filedata.size = file.size;
    this.filedata['content-type'] = file.type;
    this.filedata.encoding = 'base64';
    this.reader.readAsBinaryString(file);
  }
}
