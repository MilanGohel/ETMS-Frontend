import { Component, Input, input } from '@angular/core';
import { ProjectDto } from '../../core/models/project/project.dto';

@Component({
  selector: 'app-project-list',
  imports: [],
  templateUrl: './project-list.html',
  styleUrl: './project-list.css'
})
export class ProjectList {
   @Input() projectList = <ProjectDto[] | null>(null);

}
