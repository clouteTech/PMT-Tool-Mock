import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridConnectivities } from './grid-connectivities';

describe('GridConnectivities', () => {
  let component: GridConnectivities;
  let fixture: ComponentFixture<GridConnectivities>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridConnectivities]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridConnectivities);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
