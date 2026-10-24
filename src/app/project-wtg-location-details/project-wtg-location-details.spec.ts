import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectWtgLocationDetails } from './project-wtg-location-details';

describe('ProjectWtgLocationDetails', () => {
  let component: ProjectWtgLocationDetails;
  let fixture: ComponentFixture<ProjectWtgLocationDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectWtgLocationDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectWtgLocationDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
