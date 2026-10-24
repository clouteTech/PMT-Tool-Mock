import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WtgQuality } from './wtg-quality';

describe('WtgQuality', () => {
  let component: WtgQuality;
  let fixture: ComponentFixture<WtgQuality>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WtgQuality]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WtgQuality);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
