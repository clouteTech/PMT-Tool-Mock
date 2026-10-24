import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantAllocation } from './plant-allocation';

describe('PlantAllocation', () => {
  let component: PlantAllocation;
  let fixture: ComponentFixture<PlantAllocation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlantAllocation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantAllocation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
