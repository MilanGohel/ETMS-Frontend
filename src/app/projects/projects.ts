import { Component, OnInit, signal, inject } from '@angular/core';
import { ProjectDto, CreateProjectDto } from '../core/models';
import { ProjectService } from '../services/project/project-service';
import { ToastService } from '../services/toast/toast.service';
import { ProjectFormModal } from '../components/project-form-modal/project-form-modal';
import { ProjectList } from './project-list/project-list';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from "primeng/dialog";
import { DatePickerModule } from "primeng/datepicker";
import { lucidePlus } from '@ng-icons/lucide';
@Component({
  selector: 'app-projects',
  imports: [ProjectList, DialogModule, NgIcon, DatePickerModule, ReactiveFormsModule, ProjectFormModal],
  viewProviders: [provideIcons({
    lucidePlus
  })],
  templateUrl: './projects.html',
  styleUrl: './projects.css'
})

export class Projects implements OnInit {
  projects = signal<ProjectDto[] | null>(null);
  selectedProject: ProjectDto | null = null;
  showModal = signal<boolean>(false);

  private projectService = inject(ProjectService);
  private toastService = inject(ToastService);

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects() {
    this.projectService.getUserProjects().subscribe(response => {
      this.projects.set(response.data);
    });
  }

  openCreateModal() {
    debugger;
    this.selectedProject = null;
    
    this.showModal.set(true);
  }

  openEditModal(project: ProjectDto) {
    debugger;
    this.selectedProject = project;
    this.showModal.set(true);
  }

  handleModalClose() {
    this.showModal.set(false);
  }

  handleFormSubmit(data: CreateProjectDto | ProjectDto) {
    this.projectService.createProject(data).subscribe(response => {
      if (response.succeeded) {
        this.toastService.success('Success', response.message);
        this.showModal.set(false);
        this.loadProjects();
      } else {
        this.toastService.error('Error', response.message);
      }
    });
  }
}
