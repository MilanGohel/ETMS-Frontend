import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectFormModal } from './project-form-modal';

describe('ProjectFormModal', () => {
  let component: ProjectFormModal;
  let fixture: ComponentFixture<ProjectFormModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectFormModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectFormModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
