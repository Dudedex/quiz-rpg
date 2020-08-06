import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageSearchQuestionComponent } from './image-search-question.component';

describe('ImageSearchQuestionComponent', () => {
  let component: ImageSearchQuestionComponent;
  let fixture: ComponentFixture<ImageSearchQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageSearchQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageSearchQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
