import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { FormComponent } from './form.component';
import { SchemaFormModule } from './schema-form.module';

class BaseTest {
  schema: any = {
    type: 'object',
    properties: {
      fieldA: {
        type: 'string',
        title: 'A title',
        description: 'A description'
      }
    }
  };

  modelA: any = {};
  actions: any = {};
  validators: any = {};
}

@Component({
  selector: 'sf-test',
  template: `
    <sf-form
      [schema]="schema"
      [(ngModel)]="modelA">
    </sf-form>
  `
})
class TestBComponent extends BaseTest {}

const schemaB = {
  type: 'object',
  properties: {
    fieldB: {
      type: 'string',
      title: 'A title',
      description: 'A description'
    },
    fieldA: {
      type: 'string',
      title: 'B title',
      description: 'B description'
    }
  }
};

describe('FormComponent', () => {
  const testCases = [TestBComponent];

  testCases.forEach((testComponent, index) => {
    let fixture: ComponentFixture<BaseTest>;
    let component: BaseTest;

    beforeEach(
      async(() => {
        TestBed.configureTestingModule({
          imports: [FormsModule, SchemaFormModule.forRoot()],
          declarations: [testComponent],
          providers: []
        });
      })
    );

    describe('With NgModel', () => {
      beforeEach(
        async(() => {
          TestBed.compileComponents();
          fixture = TestBed.createComponent(testComponent);
          fixture.detectChanges();

          component = fixture.componentInstance;
        })
      );


      it('should create', () => {
        const predicate = By.directive(FormComponent);
        const form = fixture.debugElement.query(predicate).componentInstance;
        expect(form).toBeTruthy();
      });

      it('should generate form with input', () => {
        const forms = fixture.debugElement.queryAll(By.css('form'));
        expect(forms.length).toBe(1);

        const inputs = forms[0].queryAll(By.css('input'));
        expect(inputs.length).toBe(1);
      });

      it('should generate new form on schema changes', () => {
        component.schema = schemaB;
        fixture.detectChanges();

        const forms = fixture.debugElement.queryAll(By.css('form'));
        expect(forms.length).toBe(1);

        const inputs = forms[0].queryAll(By.css('input'));
        expect(inputs.length).toBe(2);
      });

      it('should support 2 way data binding', () => {
        const input = fixture.debugElement.query(By.css('input')).nativeElement;

        expect(input.value).toBeFalsy();

        component.modelA = {
          fieldA: 'A'
        };

        fixture.detectChanges();

        fixture.whenStable().then(() => {
          expect(input.value).toEqual('A');

          const value = 'CHANGED';
          input.value = value;
          input.dispatchEvent(new Event('input'));

          expect(component.modelA.fieldA).toEqual(value);
        });
      });

    });
  });
});
