import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PenaltyPointsComponent } from './penalty-points.component';

describe('PenaltyPointsComponent', () => {
  let component: PenaltyPointsComponent;
  let fixture: ComponentFixture<PenaltyPointsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PenaltyPointsComponent]
    });
    fixture = TestBed.createComponent(PenaltyPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
