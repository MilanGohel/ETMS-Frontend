import { Component, ElementRef, inject, input, Renderer2, signal, ViewChild } from '@angular/core';
import { TaskDto } from '../../../../core/models';
import { CdkDrag, CdkDragPlaceholder } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-project-task-item',
  imports: [CdkDragPlaceholder, CdkDrag],
  templateUrl: './project-task-item.component.html',
  styleUrl: './project-task-item.component.css'
})
export class ProjectTaskItemComponent {
  task = input<TaskDto>();
  @ViewChild('taskItemRef', { static: false, read: ElementRef }) taskItemRef!: ElementRef;
  @ViewChild('placeholderRef', { static: false, read: ElementRef }) placeholderRef!: ElementRef;

  placeholderHeight = signal<number>(0);

  onDragStarted() {
    const rect = this.taskItemRef.nativeElement.getBoundingClientRect()!;
    this.placeholderHeight.set(rect.height);
  }
  
  renderer = inject(Renderer2);
}
