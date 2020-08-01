import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizManagerComponent } from './quiz-manager.component';

describe('GameCreatorComponent', () => {
  let component: QuizManagerComponent;
  let fixture: ComponentFixture<QuizManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuizManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
