import { Component, EventEmitter, inject, Input, input, output, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProjectDto } from '../../core/models';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucidePen,
  lucideTrash2
} from "@ng-icons/lucide";
import { ProjectService } from '../../services/project/project-service';
import { response } from 'express';
@Component({
  selector: 'app-project-list',
  imports: [RouterLink, NgIcon],
  templateUrl: './project-list.html',
  viewProviders: [provideIcons({
    lucidePen,
    lucideTrash2
  })],
  styleUrl: './project-list.css'
})
export class ProjectList {
  projectList = input<ProjectDto[] | null>(null);
  visible: boolean = false;
  editingProject = output<ProjectDto>();

  projectService = inject(ProjectService);
  onEdit(project: ProjectDto) {
    // this.projectService.getProjectById(project.id).subscribe(
    //   response => {
    //     if(response.succeeded){
    //       this.editingProject = response.data;
    //     }
    //     else{

    //     }
    //   }
    // )
    debugger;

    this.editingProject.emit(project);
  }
  onDelete(project: ProjectDto) {

  }
}
