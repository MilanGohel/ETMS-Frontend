import { AfterViewInit, Component, ElementRef, inject, input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { TaskDto } from '../../../../core/models';
import { CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ProjectTaskItemComponent } from "../project-task-item/project-task-item.component";

@Component({
  selector: 'app-project-task',
  imports: [
    CdkDropList,
    ProjectTaskItemComponent
  ],
  templateUrl: './project-task.component.html',
  styleUrl: './project-task.component.css'
})
export class ProjectTaskComponent implements OnInit {
  tasks = input<TaskDto[]>([]);
  connectedBoards = input<string[]>([]);
  taskListId = input<string>();
  renderer = inject(Renderer2);

 
  ngOnInit(): void {
    // Fetch tasks for the current project from the API and update the signal
    // Example: fetchTasksForProject(this.projectId).subscribe(tasks => this.tasks(tasks));
  }

  drop(event: CdkDragDrop<TaskDto[]>) {
    if (event.previousContainer == event.container)
      moveItemInArray(this.tasks(), event.previousIndex, event.currentIndex);
    else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      )
    }
  }
}
