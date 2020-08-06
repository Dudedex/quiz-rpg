import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DragAndDropEditorComponent } from './drag-and-drop-editor.component';

describe('DragAndDropEditorComponent', () => {
  let component: DragAndDropEditorComponent;
  let fixture: ComponentFixture<DragAndDropEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DragAndDropEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DragAndDropEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
