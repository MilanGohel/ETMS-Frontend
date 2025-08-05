import { Component, input, OnInit, signal } from '@angular/core';
import { TaskDto } from '../../../core/models';

@Component({
  selector: 'app-project-task',
  imports: [],
  templateUrl: './project-task.component.html',
  styleUrl: './project-task.component.css'
})
export class ProjectTaskComponent implements OnInit {
    tasks = input<TaskDto[]>([]);

    ngOnInit(): void {
      // Fetch tasks for the current project from the API and update the signal
      // Example: fetchTasksForProject(this.projectId).subscribe(tasks => this.tasks(tasks));
    }

    

}
