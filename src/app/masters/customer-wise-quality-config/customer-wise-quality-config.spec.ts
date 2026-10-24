import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerWiseQualityConfig } from './customer-wise-quality-config';

describe('CustomerWiseQualityConfig', () => {
  let component: CustomerWiseQualityConfig;
  let fixture: ComponentFixture<CustomerWiseQualityConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerWiseQualityConfig]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerWiseQualityConfig);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
