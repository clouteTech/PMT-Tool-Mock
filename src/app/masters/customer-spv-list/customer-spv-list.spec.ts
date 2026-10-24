import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSpvList } from './customer-spv-list';

describe('CustomerSpvList', () => {
  let component: CustomerSpvList;
  let fixture: ComponentFixture<CustomerSpvList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerSpvList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerSpvList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
