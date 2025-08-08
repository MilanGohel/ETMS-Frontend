import { AfterViewInit, Component, ElementRef, inject, input, OnInit, output, Renderer2, ViewChild } from '@angular/core';
import { MoveTaskDto, ShiftTaskOrderRangeDto, TaskDto, UpdateTaskPositionDto } from '../../../../core/models';
import { CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ProjectTaskItemComponent } from "../project-task-item/project-task-item.component";
import { TaskService } from '../../../../services/task/task-service';
import { ToastService } from '../../../../services/toast/toast.service';


@Component({
  selector: 'app-project-task',
  imports: [
    CdkDropList,
    ProjectTaskItemComponent
  ],
  templateUrl: './project-task.component.html',
  styleUrl: './project-task.component.css'
})
export class ProjectTaskComponent {
  tasks = input<TaskDto[]>([]);
  connectedBoards = input<string[]>([]);
  taskListId = input<string>();
  renderer = inject(Renderer2);
  taskService = inject(TaskService);
  toastService = inject(ToastService);
  updateTaskPosition(updateTaskPositionDto: UpdateTaskPositionDto) {
    this.taskService.updateTaskPositions(updateTaskPositionDto).subscribe({
      next: (response) => {
        if (!response.succeeded) {
          console.error("Error updating task order", response.message);
          this.toastService.error("Error updating task order", response.message);
        }
      },
      error: (error) => {
        console.error("Error updating task order", error);
        this.toastService.error("Error updating task order", error);
      }
    });
  }

  shiftTaskOrderRange(shiftTaskOrderRangeDto: ShiftTaskOrderRangeDto) {
    this.taskService.shiftTaskOrder(shiftTaskOrderRangeDto).subscribe({
      next: (response) => {
        if (!response.succeeded) {
          console.error("Error shifting task order", response.message);
          this.toastService.error("Error shifting task order", response.message);
        }
      },
      error: (error) => {
        console.error("Error shifting task order", error);
        this.toastService.error("Error shifting task order", error);
      }
    })
  }
  drop(event: CdkDragDrop<TaskDto[]>) {
    
    const movedTask = event.previousContainer.data[event.previousIndex];
    if (!movedTask || !movedTask.id) {
      console.error('Could not find task to move.');
      return;
    }
    if (event.previousContainer === event.container) {
      moveItemInArray(this.tasks(), event.previousIndex, event.currentIndex);
    }
    else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }


    const newBoardId = Number(event.container.id.split('-')[1]);

    const newTaskArray = event.container.data;
    const previousTaskId = event.currentIndex <= 0 ? null : newTaskArray[event.currentIndex - 1].id;
    const nextTaskId = event.currentIndex < newTaskArray.length - 1 ? newTaskArray[event.currentIndex + 1].id : null;


    const moveTaskDto: MoveTaskDto = {
      taskIdToMove: movedTask.id,
      newBoardId: newBoardId,
      previousTaskId: previousTaskId,
      nextTaskId: nextTaskId
    }

    console.log(
      JSON.stringify(moveTaskDto) + " Move TaskDto"
    )


    this.taskService.moveTask(moveTaskDto).subscribe({
      next: (response) => {
        
        if (!response.succeeded) {
          console.error("Error moving task", response.message);
          this.toastService.error("Error moving task", response.message);
        }
      },
      error: (error) => {
        
        console.error("Error moving task", error);
        this.toastService.error("Error moving task", error.errors[0]);
      }
    })

  }
}
