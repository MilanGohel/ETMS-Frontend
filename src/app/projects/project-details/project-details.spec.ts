import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDetails } from './project-details';

describe('ProjectDetails', () => {
  let component: ProjectDetails;
  let fixture: ComponentFixture<ProjectDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
