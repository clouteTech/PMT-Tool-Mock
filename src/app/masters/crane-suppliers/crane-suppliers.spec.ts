import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CraneSuppliers } from './crane-suppliers';

describe('CraneSuppliers', () => {
  let component: CraneSuppliers;
  let fixture: ComponentFixture<CraneSuppliers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CraneSuppliers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CraneSuppliers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
