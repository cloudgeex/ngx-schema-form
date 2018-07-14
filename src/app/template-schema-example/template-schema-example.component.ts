import { Component, OnInit } from '@angular/core';
import { AbstractControl,ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-template-schema-example',
  templateUrl: './template-schema-example.component.html',
  styleUrls: ['./template-schema-example.component.css']
})
export class TemplateSchemaExampleComponent implements OnInit {

  model: any = {
    recipient: {
      firstName: 'Pepe',
      lastName: 'Canelo',
      categories: [
        'dog',
        'cat'
      ],
      colors: []
    },
    survey: {
      q1: 'aSDASd',
      q2: {
        number: 10147
      }
    },
    transaction: {
      category: []
    },
    shipping: {},
    contact: {},
    confirmation: {
      confirmationEmail: 'admin@example.com',
      password: 'admin'
    }
  };

  constructor() { }

  onClick(message: string) {
    alert(message);
  }

  isPepe(control: AbstractControl): ValidationErrors {
    if (!control.pristine && control.value !== 'pepe')  {
      return { message: 'is not pepe' };
    }

    return null;
  }

  ngOnInit() {
  }

}
