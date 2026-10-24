import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WtgDispatch } from './wtg-dispatch';

describe('WtgDispatch', () => {
  let component: WtgDispatch;
  let fixture: ComponentFixture<WtgDispatch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WtgDispatch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WtgDispatch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
