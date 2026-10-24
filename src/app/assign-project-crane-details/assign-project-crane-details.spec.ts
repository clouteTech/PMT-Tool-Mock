import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignProjectCraneDetails } from './assign-project-crane-details';

describe('AssignProjectCraneDetails', () => {
  let component: AssignProjectCraneDetails;
  let fixture: ComponentFixture<AssignProjectCraneDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignProjectCraneDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignProjectCraneDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
