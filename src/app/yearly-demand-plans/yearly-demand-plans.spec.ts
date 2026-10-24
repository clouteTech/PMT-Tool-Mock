import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearlyDemandPlans } from './yearly-demand-plans';

describe('YearlyDemandPlans', () => {
  let component: YearlyDemandPlans;
  let fixture: ComponentFixture<YearlyDemandPlans>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YearlyDemandPlans]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YearlyDemandPlans);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
