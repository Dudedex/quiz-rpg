import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioAndCheckboxEditorComponent } from './radio-and-checkbox-editor.component';

describe('RadioAndCheckboxEditorComponent', () => {
  let component: RadioAndCheckboxEditorComponent;
  let fixture: ComponentFixture<RadioAndCheckboxEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadioAndCheckboxEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioAndCheckboxEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
