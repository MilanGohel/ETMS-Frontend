import { Component, inject, input, Renderer2 } from '@angular/core';
import { MoveTaskDto, ShiftTaskOrderRangeDto, TaskDto, UpdateTaskPositionDto } from '../../../../core/models';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ProjectTaskItemComponent } from "../project-task-item/project-task-item.component";
import { TaskService } from '../../../../services/task/task-service';
import { ToastService } from '../../../../services/toast/toast.service';
import { BoardService } from '../../../../services/board/board-service';
import { ProjectTaskEditModal } from "../project-task-edit-modal/project-task-edit-modal";
import { BoardStateService } from '../../../../services/board/board-state-service';


@Component({
  selector: 'app-project-task',
  imports: [
    CdkDropList,
    ProjectTaskItemComponent,
    CdkDrag
  ],
  templateUrl: './project-task.component.html',
  styleUrl: './project-task.component.css'
})


export class ProjectTaskComponent {
  tasks = input<TaskDto[]>([]);
  connectedBoards = input<string[]>([]);
  taskListId = input<string>();

  // Inject the single source of truth for board state
  boardStateService = inject(BoardStateService);
}