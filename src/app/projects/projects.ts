import { Component, inject, OnInit, signal } from '@angular/core';
import { ProjectDto } from '../core/models/project/project.dto';
import { ProjectService } from '../services/project/project-service';
import { response } from 'express';
import { sign } from 'crypto';
import { ProjectList } from "./project-list/project-list";

@Component({
  selector: 'app-projects',
  imports: [ProjectList],
  templateUrl: './projects.html',
  styleUrl: './projects.css'
})
export class Projects implements OnInit {
  projectService = inject(ProjectService);

  projects = signal<ProjectDto[] | null>(null);

  isLoading = signal(false);

  errorOccurred = signal(false);
  ngOnInit(): void {
    this.projectService.getUserProjects().subscribe(response => {
      this.projects.set(response.data);
      this.isLoading.set(true);
      
      if (response === null) {
        this.errorOccurred.set(true);
      }
    });
  }

}
