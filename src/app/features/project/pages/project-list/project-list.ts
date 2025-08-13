import { Component, EventEmitter, inject, Input, input, output, Output, signal, WritableSignal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucidePen,
  lucidePlus,
  lucideTrash2
} from "@ng-icons/lucide";
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ProjectDto } from '../../../../core/models';
import { ProjectService } from '../../../../services/project/project-service';
import { ToastService } from '../../../../services/toast/toast.service';
import { ProjectFormModal } from '../../components/project-form-modal/project-form-modal';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [
    RouterLink,
    NgIcon,
    ProjectFormModal,
    ButtonModule,
    ConfirmPopupModule
  ],
  templateUrl: './project-list.html',
  viewProviders: [provideIcons({ lucidePen, lucideTrash2, lucidePlus })],
  styleUrl: './project-list.css'
})
export class ProjectList {
  projectList: WritableSignal<ProjectDto[] | null> = signal(null);
  selectedProject: ProjectDto | null = null;
  showModal = signal(false);
  private confirmationService = inject(ConfirmationService);
  private projectService = inject(ProjectService);
  private toastService = inject(ToastService);
  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects() {
    this.projectService.getUserProjects().subscribe(res => this.projectList.set(res.data));
  }

  isEditingProject = false;

  openCreateModal() {
    this.isEditingProject = false;
    this.selectedProject = null;
    this.showModal.set(true);
  }

  openEditModal(project: ProjectDto) {
    this.isEditingProject = true;
    this.selectedProject = project;
    this.showModal.set(true);
  }

  handleModalClose() {
    this.showModal.set(false);
  }

  handleFormSubmit(data: ProjectDto) {
    
    const isNew = data.id <= 0;
    const req = isNew ? this.projectService.createProject(data) : this.projectService.updateProject(data);

    req.subscribe(res => {
      if (res.succeeded) {
        this.toastService.success('Success', res.message);
        this.showModal.set(false);
        this.loadProjects();
      } else {
        this.toastService.error('Error', res.message);
      }
    });
  }

  onDelete(event: Event, project: ProjectDto): void {
    this.confirmationService.confirm({
      key: 'deleteConfirm',
      target: event.currentTarget as EventTarget,
      message: 'Are you sure you want to proceed?',
      rejectButtonProps: {
        label: "Cancel",
        severnity: "secondary",
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger'
      },
      accept: () => {
        this.projectService.deleteProject(project.id).subscribe({
          next: (response) => {
            if (response.succeeded) {
              this.toastService.info("Info", response.message);
            }
            this.loadProjects();
          },
          error: (error) => {
            this.toastService.error("Error", error?.message);
          }
        })
      }
    });
  }


}
