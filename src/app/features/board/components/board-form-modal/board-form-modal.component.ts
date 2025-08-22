import { Component, inject, Input, input, OnInit, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ColorPickerModule } from 'primeng/colorpicker';
import { NgClass } from '@angular/common';
import { presetColors } from '../../../../shared/constants/constant';
import { BoardDto } from '../../models/board.model';
@Component({
  selector: 'app-board-form-modal',
  imports: [
    DialogModule,
    NgClass,
    ReactiveFormsModule,
    ColorPickerModule,
   
  ],
  templateUrl: './board-form-modal.component.html',
  styleUrl: './board-form-modal.component.css'
})
export class BoardFormModalComponent implements OnInit {
  ngOnInit(): void {
    this.boardForm.get('colorCode')?.valueChanges.subscribe(value => {
      this.colorValue = value;
    })
  }
  fb = inject(FormBuilder);
  projectId = input<number>(0);
  board = input<BoardDto | null>(null);
  @Input() visible = false;

  onClose = output<void>();
  onSubmit = output<BoardDto>();

  boardForm = this.fb.group({
    name: ['', Validators.required],
    colorCode: ['#ffffff', Validators.required],
    projectId: [this.projectId],
  })

  closeDialog() {
    this.onClose.emit();
  }

  colorValue: string | null = "#ffffff"
  presetColors = presetColors;

  selectPresetColor(color: string) {
    this.colorValue = color;
    this.boardForm.patchValue({ colorCode: color });
  }

  get name() {
    return this.boardForm.get("name");
  }

  get colorCode() {
    return this.boardForm.get("colorCode");
  }

  submitForm() {
    
    if (this.boardForm.valid) {
      const board: BoardDto = {
        name: this.boardForm.value.name!.trim(),
        colorCode: this.colorCode!.value,
        projectId: this.projectId(),
        tasks: [] // Assuming tasks are not included in the form
      };
      this.onSubmit.emit(board);
      this.boardForm.reset();
    }
  }
}

