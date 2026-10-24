import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantWiseProductionConfig } from './plant-wise-production-config';

describe('PlantWiseProductionConfig', () => {
  let component: PlantWiseProductionConfig;
  let fixture: ComponentFixture<PlantWiseProductionConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlantWiseProductionConfig]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantWiseProductionConfig);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
