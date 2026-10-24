import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllocation } from './view-allocation';

describe('ViewAllocation', () => {
  let component: ViewAllocation;
  let fixture: ComponentFixture<ViewAllocation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAllocation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAllocation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
