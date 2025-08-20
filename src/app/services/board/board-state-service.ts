// src/app/services/board/board-state.service.ts
import { computed, inject, Injectable, signal } from '@angular/core';
import { BoardDto, MoveBoardDto, MoveTaskDto, StatusEnum, TaskDto } from '../../core/models';
import { BoardService } from './board-service';
import { TaskService } from '../task/task-service';
import { ToastService } from '../toast/toast.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BoardStateService {
  private boardService = inject(BoardService);
  private taskService = inject(TaskService);
  private toastService = inject(ToastService);

  // --- Private State Signals ---
  private readonly _boards = signal<BoardDto[]>([]);
  private readonly _editingTask = signal<TaskDto | null>(null);

  // --- Public Readonly State ---
  public readonly boards = this._boards.asReadonly();
  public readonly editingTask = this._editingTask.asReadonly();
  public readonly connectedBoardIds = computed(() => this.boards().map(board => `board-${board.id}`));

  // --- Derived State for UI Control ---
  public readonly isTaskEditModalVisible = computed(() => !!this._editingTask());
  public readonly isBoardDragDisabled = this.isTaskEditModalVisible;

  

  loadBoards(projectId: number): void {
    this.boardService.getBoardsByProjectId(projectId).subscribe({
      next: res => {
        if (res.succeeded) {
          this._boards.set(res.data);
        }
      },
      error: err => this.toastService.error('Error', 'Failed to load boards.')
    });
  }

  updateBoard(board: BoardDto): void {
    // Optimistically update the UI
    this._boards.update(currentBoards =>
      currentBoards.map(b => b.id === board.id ? board : b)
    );

    this.boardService.updateBoard(board).subscribe({
      error: err => {
        this.toastService.error("Update Failed", err.message);
        // Optionally, revert the change on error
        this.loadBoards(board.projectId);
      }
    });
  }

  createTask(boardId: number, taskName: string, isAddedAtEnd: boolean): void {
    const newTask: TaskDto = {
      name: taskName,
      boardId: boardId,
      statusId: StatusEnum.Pending,
      isAddedAtEndOfBoard: isAddedAtEnd
    };

    this.taskService.createTask(newTask).pipe(
      tap(response => {
        if (!response.succeeded) {
          this.toastService.error("Error", response.message);
          return;
        }
        const createdTask = response.data;
        this._boards.update(currentBoards => {
          const boardIndex = currentBoards.findIndex(b => b.id === boardId);
          if (boardIndex === -1) return currentBoards;

          const updatedBoard = { ...currentBoards[boardIndex] };
          const tasks = updatedBoard.tasks ? [...updatedBoard.tasks] : [];

          if (isAddedAtEnd) {
            tasks.push(createdTask);
          } else {
            tasks.unshift(createdTask);
          }
          updatedBoard.tasks = tasks;

          const newBoards = [...currentBoards];
          newBoards[boardIndex] = updatedBoard;
          return newBoards;
        });
      })
    ).subscribe({
      error: err => this.toastService.error("Error", err.message)
    });
  }
  moveTask(event: CdkDragDrop<TaskDto[]>) {
    
    // Get the moved task data reliably from its original container and index
    const movedTask = event.previousContainer.data[event.previousIndex];

    if (!movedTask?.id) return;

    // Optimistically update the UI
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }

    // Prepare DTO for the backend
    const newBoardId = Number(event.container.id.split('-')[1]);
    const newTaskArray = event.container.data;
    const previousTaskId = event.currentIndex > 0 ? newTaskArray[event.currentIndex - 1].id : undefined;
    const nextTaskId = event.currentIndex < newTaskArray.length - 1 ? newTaskArray[event.currentIndex + 1].id : undefined;

    const moveTaskDto: MoveTaskDto = { newBoardId, previousTaskId, nextTaskId };

    this.taskService.moveTask(movedTask.id, moveTaskDto).subscribe({
      error: err => {
        this.toastService.error("Error", "Failed to move task.");
        // NOTE: In a real app, you might want to revert the optimistic UI update here.
      }
    });
  }
  moveBoard(previousIndex: number, currentIndex: number): void {
    
    const boardsArray = [...this.boards()];
    const movedBoard = boardsArray[previousIndex];
    if (!movedBoard?.id) return;

    // Optimistically update the UI
    moveItemInArray(boardsArray, previousIndex, currentIndex);
    this._boards.set(boardsArray);

    const previousBoardId = currentIndex > 0 ? boardsArray[currentIndex - 1].id : undefined;
    const nextBoardId = currentIndex < boardsArray.length - 1 ? boardsArray[currentIndex + 1].id : undefined;

    const moveDto: MoveBoardDto = { previousBoardId, nextBoardId };

    this.boardService.moveBoard(movedBoard.id, moveDto).subscribe({
      error: err => {
        this.toastService.error("Error", err.message);
        // Revert on error
        moveItemInArray(boardsArray, currentIndex, previousIndex);
        this._boards.set(boardsArray);
      }
    });
  }

  selectTaskForEditing(task: TaskDto | null): void {
    this._editingTask.set(task);
  }
}