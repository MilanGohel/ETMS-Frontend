import { Component, inject, OnInit, signal, ViewChild, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideLayoutDashboard,
  lucidePlus,
  lucideDownload,
  lucideSettings,
  lucideBell,
  lucideListFilter,
  lucideArrowUpDown,
  lucideEllipsisVertical,
  lucideFileCheck,
  lucideFileText
} from '@ng-icons/lucide';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProjectService } from '../../../../services/project/project-service';
import { BoardComponent } from '../../../board/components/board/board.component';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { BoardFormModalComponent } from "../../../board/components/board-form-modal/board-form-modal.component";
import { BoardStateStore } from '../../../board/store/board-state.store';
import { FindMembersDialogComponent } from "../../../members/components/find-members-dialog/find-members-dialog.component";
import { GlobalStateStore } from '../../../shared/store/global-state-store/global-state-store';
import { BoardService } from '../../../board/services/board-service';
import { ProjectDto } from '../../models/project.model';
import { BoardDto } from '../../../board/models/board.model';
@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbModule,
    ButtonModule,
    NgIcon,
    RouterLink,
    BoardComponent,
    BoardFormModalComponent,
    FindMembersDialogComponent
  ],
  viewProviders: [provideIcons({
    lucideLayoutDashboard,
    lucidePlus,
    lucideDownload,
    lucideSettings,
    lucideBell,
    lucideListFilter,
    lucideArrowUpDown,
    lucideEllipsisVertical,
    lucideFileText
  })],
  templateUrl: './project-details.html',
  styleUrl: './project-details.css'
})
export class ProjectDetails implements OnInit {
  boardState = inject(BoardStateStore);

  projectId: number = 0;
  currentProject: WritableSignal<ProjectDto | null> = signal(null);
  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService
  ) { }

  ngOnInit(): void {
    this.projectId = +this.activeRoute.snapshot.paramMap.get('id')!;
    this.loadProject();
  }

  loadProject() {
    this.projectService.getProjectById(this.projectId).subscribe(response => {
      if (response.succeeded) {
        this.currentProject.set(response.data);
      }
      else {
        //do something if project no found  or error occurs
        // currently redirecting user back to project list
        this.router.navigate(["projects"]);
      }
    })
  }


  items: MenuItem[] = [
    {
      icon: 'lucideFileText',
      routerLink: ['/tasks'], // Example link,
    },
    {
      label: 'Project',
      routerLink: ['/projects'], // Example link,
    },
    {
      label: 'Overview'
    }
  ];

  // Data for avatars (replace with real data)
  members = [
    { name: 'Member 1', img: 'https://i.pravatar.cc/150?img=1' },
    { name: 'Member 2', img: 'https://i.pravatar.cc/150?img=2' },
    { name: 'Member 3', img: 'https://i.pravatar.cc/150?img=3' },
  ];

  // Data for navigation tabs
  navTabs = ['Board', 'List', 'Timeline', 'Due Tasks'];
  activeTab = 'Board';

  boardService = inject(BoardService);
  toast = inject(ToastService);
  selectedBoard = signal<BoardDto | null>(null);
  showBoardModal = signal(false);
  boardStateService = inject(BoardStateStore);
  globalStateStore = inject(GlobalStateStore);

  openCreateBoardModal() {
    this.selectedBoard.set(null);
    this.showBoardModal.set(true);
  }

  openEditBoardModal(board: BoardDto) {
    this.selectedBoard.set(board);
    this.showBoardModal.set(true);
  }

  onBoardSubmit(boardDto: BoardDto) {
    const request = !boardDto.id
      ? this.boardService.createNewBoard(boardDto)
      : this.boardService.updateBoard(boardDto);

    request.subscribe({
      next: (res) => {
        if (res.succeeded) {
          this.toast.success("Success", res.message);
          this.showBoardModal.set(false);
          this.boardState.loadBoards(this.projectId);
        }
      },
      error: (err) => {
        this.toast.error("Error", err.message);
      }
    });
  }

  openFindMembersModal() {
    this.globalStateStore.setIsFindMemberModalOpen(true);
  }
}