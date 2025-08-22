import { Component, inject, input, Renderer2 } from '@angular/core';
import { CdkDrag, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TaskItemComponent } from "../task-item/task-item.component";
import { BoardStateStore } from '../../../board/store/board-state.store';
import { TaskDto } from '../../models/task.model';


@Component({
  selector: 'app-task-list',
  imports: [
    CdkDropList,
    TaskItemComponent,
    CdkDrag
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})


export class TaskListComponent {
  tasks = input<TaskDto[]>([]);
  connectedBoards = input<string[]>([]);
  taskListId = input<string>();

  // Inject the single source of truth for board state
  boardStateService = inject(BoardStateStore);
}