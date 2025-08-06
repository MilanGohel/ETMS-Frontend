import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectTaskItemComponent } from './project-task-item.component';

describe('ProjectTaskItemComponent', () => {
  let component: ProjectTaskItemComponent;
  let fixture: ComponentFixture<ProjectTaskItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectTaskItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectTaskItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
