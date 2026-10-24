import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyPlan } from './monthly-plan';

describe('MonthlyPlan', () => {
  let component: MonthlyPlan;
  let fixture: ComponentFixture<MonthlyPlan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyPlan]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyPlan);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
