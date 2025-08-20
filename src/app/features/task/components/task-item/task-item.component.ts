import { Component, ElementRef, EventEmitter, inject, input, Output, output, Renderer2, signal, ViewChild, WritableSignal } from '@angular/core';
import { TaskDto } from '../../../../core/models';
import { CdkDrag, CdkDragPlaceholder } from '@angular/cdk/drag-drop';
import { BoardService } from '../../../../services/board/board-service';

@Component({
  selector: 'app-task-item',
  imports: [CdkDragPlaceholder],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.css'
})
export class TaskItemComponent {
  task = input<TaskDto>();
  @ViewChild('taskItemRef', { static: false, read: ElementRef }) taskItemRef!: ElementRef;
  @ViewChild('placeholderRef', { static: false, read: ElementRef }) placeholderRef!: ElementRef;

  placeholderHeight = signal<number>(0);

  onDragStarted() {
    const rect = this.taskItemRef.nativeElement.getBoundingClientRect()!;
    this.placeholderHeight.set(rect.height);
  }

  renderer = inject(Renderer2);
  boardService = inject(BoardService);

  @Output() onTaskClick = new EventEmitter<TaskDto>();

}
