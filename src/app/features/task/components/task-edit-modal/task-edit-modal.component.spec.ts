import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskEditModalComponent } from './task-edit-modal.component';

describe('ProjectTaskEditModal', () => {
  let component: TaskEditModalComponent;
  let fixture: ComponentFixture<TaskEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskEditModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
