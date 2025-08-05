import { Component, inject, input, OnChanges, OnInit, output, signal, SimpleChanges, WritableSignal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEllipsisVertical, lucidePlus } from "@ng-icons/lucide";
import { BoardService } from '../../../../services/board/board-service';
import { BoardDto } from '../../../../core/models';
import { ToastService } from '../../../../services/toast/toast.service';
import { NgClass, NgStyle } from '@angular/common';
import { PopoverModule } from 'primeng/popover';
import { presetColors } from '../../../../shared/constants/constant';
import { ColorPicker } from 'primeng/colorpicker';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-board-component',
  imports: [NgIcon, NgStyle, PopoverModule, NgClass, ColorPicker, FormsModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
  viewProviders: [provideIcons({
    lucidePlus,
    lucideEllipsisVertical
  })],
})

export class BoardComponent implements OnInit {
  boards: WritableSignal<BoardDto[]> = signal([]);
  projectId = input<number>(0);
  showBoardModal: WritableSignal<boolean> = signal<boolean>(false);
  private boardService = inject(BoardService);
  selectedBoard: WritableSignal<BoardDto | null> = signal(null);
  toastService = inject(ToastService);

  boardEdit = output<BoardDto>();
  boardCreate = output<void>();

  isNameEditing = signal<boolean>(false);
  isOptionsPopoverOpen = signal<boolean>(false);

  editingBoard: WritableSignal<BoardDto | null> = signal(null);

  presetColors = presetColors;
  colorValue = signal<string>('');

  selectPresetColor(preset: string) {
    this.colorValue.set(preset);
  }

  onNameDblClick(board: BoardDto) {
    this.editingBoard.set(board);
    this.isNameEditing.set(true);
    setTimeout(() => {
      // Focus the input after it's visible
      const input = document.getElementById('board-name-input');
      if (input) {
        (input as HTMLInputElement).focus();
      }
    });
  }

  onEditNameInput(event: Event) {
    this.editingBoard.update((previous) => {
      return { ...previous, name: (event.target as HTMLInputElement)?.value } as BoardDto;
    })
  }

  onBoardColorChange() {
    if (!this.editingBoard()) return;

    this.editingBoard.update(prev => {
      return { ...prev, colorCode: this.colorValue() } as BoardDto
    })

    this.boardService.updateBoard(this.editingBoard()!).subscribe({
      next: res => {
        if (res.succeeded) {
          console.log("Color Changed");
          
          this.loadBoards();
        }
      },
      error: error => {
        this.toastService.error("Error", error.message);
      }
    })


    this.editingBoard.set(null); this.colorValue.set('');
  }

  onNameInputBlur() {
    if (this.editingBoard()?.name.trim() && this.editingBoard!.name !== this.editingBoard()?.name.trim()) {

      console.log(this.editingBoard() + "edited")
      // this.boardNameChange.emit(this.editedName.trim());
      if (!this.editingBoard()) return;

      this.boardService.updateBoard(this.editingBoard()!).subscribe({
        next: res => {
          if (res.succeeded) {
            console.log("Name Changed");
          }
        },
        error: error => {
          this.toastService.error("Error", error.message);
        }
      })

      this.editingBoard.set(null);
      this.isNameEditing.set(false);
    }
  }


  ngOnInit(): void {
    if (!this.projectId) {
      console.error('projectId is undefined or invalid');
      return;
    }
    this.loadBoards()
  }

  loadBoards() {
    this.boardService.getBoardsByProjectId(this.projectId()).subscribe({
      next: res => {
        if (res.succeeded) {
          console.log(res)
          this.boards.set(res.data);
        }
      },
      error: err => {
        console.error('Board loading failed', err);
      }
    });

  }
}
