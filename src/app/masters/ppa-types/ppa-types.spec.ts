import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PpaTypes } from './ppa-types';

describe('PpaTypes', () => {
  let component: PpaTypes;
  let fixture: ComponentFixture<PpaTypes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PpaTypes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PpaTypes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
