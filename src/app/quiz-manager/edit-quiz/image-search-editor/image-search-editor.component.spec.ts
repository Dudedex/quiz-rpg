import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageSearchEditorComponent } from './image-search-editor.component';

describe('ImageSearchEditorComponent', () => {
  let component: ImageSearchEditorComponent;
  let fixture: ComponentFixture<ImageSearchEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageSearchEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageSearchEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
