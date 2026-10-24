import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WtgDispatchForm } from './wtg-dispatch-form';

describe('WtgDispatchForm', () => {
  let component: WtgDispatchForm;
  let fixture: ComponentFixture<WtgDispatchForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WtgDispatchForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WtgDispatchForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
