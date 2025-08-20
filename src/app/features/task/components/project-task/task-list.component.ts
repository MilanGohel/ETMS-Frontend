import { Component, inject, input, Renderer2 } from '@angular/core';
import { TaskDto } from '../../../../core/models';
import { CdkDrag, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TaskItemComponent } from "../task-item/task-item.component";
import { BoardStateService } from '../../../../services/board/board-state-service';
import { BoardStateStore } from '../../../../stores/board-state-store/board-state.store';


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