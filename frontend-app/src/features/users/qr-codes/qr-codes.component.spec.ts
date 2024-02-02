import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrCodesComponent } from './qr-codes.component';

describe('QrCodesComponent', () => {
  let component: QrCodesComponent;
  let fixture: ComponentFixture<QrCodesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QrCodesComponent]
    });
    fixture = TestBed.createComponent(QrCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
