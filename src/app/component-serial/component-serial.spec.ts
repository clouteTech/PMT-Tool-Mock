import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentSerial } from './component-serial';

describe('ComponentSerial', () => {
  let component: ComponentSerial;
  let fixture: ComponentFixture<ComponentSerial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentSerial]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentSerial);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
