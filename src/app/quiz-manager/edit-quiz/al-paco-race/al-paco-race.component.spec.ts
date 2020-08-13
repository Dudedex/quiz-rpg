import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlPacoRaceComponent } from './al-paco-race.component';

describe('AlPacoRaceComponent', () => {
  let component: AlPacoRaceComponent;
  let fixture: ComponentFixture<AlPacoRaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlPacoRaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlPacoRaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
