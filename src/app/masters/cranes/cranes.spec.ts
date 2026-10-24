import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cranes } from './cranes';

describe('Cranes', () => {
  let component: Cranes;
  let fixture: ComponentFixture<Cranes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cranes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cranes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
