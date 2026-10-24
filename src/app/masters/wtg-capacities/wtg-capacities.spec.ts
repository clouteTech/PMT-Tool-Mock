import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WtgCapacities } from './wtg-capacities';

describe('WtgCapacities', () => {
  let component: WtgCapacities;
  let fixture: ComponentFixture<WtgCapacities>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WtgCapacities]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WtgCapacities);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
