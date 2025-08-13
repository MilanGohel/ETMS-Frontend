// src/app/components/board/board.component.ts
import { Component, computed, ElementRef, inject, input, OnInit, signal, WritableSignal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEllipsisVertical, lucidePlus } from "@ng-icons/lucide";
import { BoardDto } from '../../../../core/models';
import { NgClass, NgStyle } from '@angular/common';
import { PopoverModule } from 'primeng/popover';
import { presetColors } from '../../../../shared/constants/constant';
import { ColorPickerModule } from 'primeng/colorpicker';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ProjectTaskComponent } from '../../../task/components/project-task/project-task.component';
import { CdkDrag, CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { BoardStateService } from '../../../../services/board/board-state-service';
import { ProjectTaskEditModal } from "../../../task/components/project-task-edit-modal/project-task-edit-modal";

@Component({
  selector: 'app-board-component',
  standalone: true, // Assuming standalone for modern Angular
  imports: [
    NgIcon, NgStyle, NgClass, FormsModule,
    PopoverModule, ColorPickerModule, InputTextModule,
    ProjectTaskComponent, DragDropModule,
    ProjectTaskEditModal
],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
  viewProviders: [provideIcons({ lucidePlus, lucideEllipsisVertical })],
})
export class BoardComponent implements OnInit {
  projectId = input.required<number>();

  // Injected state service
  boardStateService = inject(BoardStateService);

  // Component state now sourced from the service
  boards = this.boardStateService.boards;
  connectedBoards = this.boardStateService.connectedBoardIds;

  // Local UI state signals
  editingBoard: WritableSignal<BoardDto | null> = signal(null);
  newTaskInputValue = signal('');
  showAddTaskInputForBoard = signal<{ id: number | null, position: 'start' | 'end' }>({ id: null, position: 'end' });

  readonly presetColors = presetColors;

  ngOnInit(): void {
    this.boardStateService.loadBoards(this.projectId());
  }

  // --- Board Edit Events ---

  onNameDblClick(board: BoardDto): void {
    this.editingBoard.set({ ...board }); // Create a copy for editing
  }

  onBoardNameChange(event: Event): void {
    const newName = (event.target as HTMLInputElement).value;
    this.editingBoard.update(board => board ? { ...board, name: newName } : null);
  }

  onBoardNameBlur(): void {
    const board = this.editingBoard();
    if (board && board.name.trim()) {
      this.boardStateService.updateBoard(board);
    }
    this.editingBoard.set(null);
  }

  onBoardColorChange(color: string, board: BoardDto): void {
    const updatedBoard = { ...board, colorCode: color };
    this.boardStateService.updateBoard(updatedBoard);
  }

  // --- Task Creation Events ---

  onAddNewTaskClick(boardId: number, position: 'start' | 'end'): void {
    this.showAddTaskInputForBoard.set({ id: boardId, position });
    setTimeout(() => {
      const inputElement = document.getElementById(`new-task-input-${boardId}`);
      inputElement?.focus();
    }, 0);
  }

  onBlurNewTask(boardId: number | undefined): void {
    if (!boardId || !this.newTaskInputValue().trim()) {
      this.resetNewTaskState();
      return;
    }
    const { position } = this.showAddTaskInputForBoard();
    this.boardStateService.createTask(boardId, this.newTaskInputValue(), position === 'end');
    this.resetNewTaskState();
  }

  private resetNewTaskState(): void {
    this.showAddTaskInputForBoard.set({ id: null, position: 'end' });
    this.newTaskInputValue.set('');
  }

  // --- Drag and Drop Events ---

  onBoardDrop(event: CdkDragDrop<BoardDto[]>): void {
    if (event.previousIndex === event.currentIndex) return;
    this.boardStateService.moveBoard(event.previousIndex, event.currentIndex);
  }
}