import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TowerTypes } from './tower-types';

describe('TowerTypes', () => {
  let component: TowerTypes;
  let fixture: ComponentFixture<TowerTypes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TowerTypes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TowerTypes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
