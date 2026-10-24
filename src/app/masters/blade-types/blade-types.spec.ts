import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BladeTypes } from './blade-types';

describe('BladeTypes', () => {
  let component: BladeTypes;
  let fixture: ComponentFixture<BladeTypes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BladeTypes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BladeTypes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
