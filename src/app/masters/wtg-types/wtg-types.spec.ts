import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WtgTypes } from './wtg-types';

describe('WtgTypes', () => {
  let component: WtgTypes;
  let fixture: ComponentFixture<WtgTypes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WtgTypes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WtgTypes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
