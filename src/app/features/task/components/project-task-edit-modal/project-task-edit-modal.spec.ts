import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectTaskEditModal } from './project-task-edit-modal';

describe('ProjectTaskEditModal', () => {
  let component: ProjectTaskEditModal;
  let fixture: ComponentFixture<ProjectTaskEditModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectTaskEditModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectTaskEditModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
