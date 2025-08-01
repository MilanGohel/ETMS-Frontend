import { Component, inject, input, OnInit, signal, WritableSignal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEllipsisVertical, lucidePlus } from "@ng-icons/lucide";
import { BoardDto } from '../core/models';
import { BoardService } from '../services/board/board-service';
@Component({
  selector: 'app-board-component',
  imports: [NgIcon],
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

  private boardService = inject(BoardService);

  ngOnInit(): void {
    if (!this.projectId) {
      console.error('projectId is undefined or invalid');
      return;
    }

    this.boardService.getBoardsByProjectId(this.projectId()).subscribe(
      response => {
        if (response.succeeded) {
          this.boards.set(response.data);
        }
      },
      error => {
        console.error('Board loading failed', error);
      }
    );
  }
}
