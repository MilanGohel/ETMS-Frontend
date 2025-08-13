// src/app/components/task/project-task-edit-modal/project-task-edit-modal.ts
import { Component, inject, input, OnDestroy, OnInit, output, OnChanges, SimpleChanges } from '@angular/core';
import { TaskDto } from '../../../../core/models';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { BoardStateService } from '../../../../services/board/board-state-service';
import { TaskService } from '../../../../services/task/task-service';
import { response } from 'express';
import { ToastService } from '../../../../services/toast/toast.service';

@Component({
  selector: 'app-project-task-edit-modal',
  standalone: true,
  imports: [DialogModule, ReactiveFormsModule, ButtonModule, NgxEditorModule],
  templateUrl: './project-task-edit-modal.html',
})
export class ProjectTaskEditModal implements OnChanges, OnDestroy {
  editingTask = input<TaskDto | null>(null);
  visible = input<boolean>(false);
  close = output<void>();

  private fb = inject(FormBuilder);
  boardStateService = inject(BoardStateService);
  taskService = inject(TaskService);
  taskForm!: FormGroup;
  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  constructor() {
    this.editor = new Editor();
    this.taskForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      statusId: [1, Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // When the editingTask input changes, patch the form with the new data
    if (changes['editingTask'] && this.editingTask()) {
      this.taskForm.patchValue({
        name: this.editingTask()?.name,
        description: this.editingTask()?.description,
        statusId: this.editingTask()?.statusId
      });
    }
  }
  toastService = inject(ToastService);
  onSubmitForm(): void {
    if (this.taskForm.invalid) return;

    // Delegate the update logic to the state service
    const task = {...this.boardStateService.editingTask(), ...this.taskForm.value}
    this.taskService.updateTask(task).subscribe({
      next: (response) => {
        console.log(JSON.stringify(response) + "response")
        if(!response.succeeded){
          this.toastService.error("Error Updating the task", response.message);
        }
      },
      error: (err) => {
        console.log(JSON.stringify(err));
        this.toastService.error("Error Updating the task", err.error.error.message);
      }
    });
  }

  onCloseDialog(): void {
    debugger;
    this.close.emit();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }
}