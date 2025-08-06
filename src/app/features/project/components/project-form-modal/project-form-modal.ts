import {
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
  WritableSignal,
  inject,
  OnInit,
  OnChanges,
  SimpleChanges,
  input
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { ProjectDto, StatusEnum } from '../../../../core/models';
import { dateRangeValidator } from '../../../../shared/validators/dateRange.validator';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-project-form-modal',
  templateUrl: './project-form-modal.html',
  styleUrls: ['./project-form-modal.css'],
  standalone: true,
  imports: [ReactiveFormsModule, DatePicker, DialogModule, CommonModule, CheckboxModule, ButtonModule]
})
export class ProjectFormModal implements OnInit, OnChanges {
  @Input() visible = false;
  @Input() project: ProjectDto | null = null;
  isEditing = input<boolean>(false);

  @Output() onClose = new EventEmitter<void>();
  @Output() onSubmit = new EventEmitter<ProjectDto>();

  fb = inject(FormBuilder);
  form!: FormGroup;

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      isAddDefaultBoards: [false]
    }, dateRangeValidator);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['project'] && this.project) {
      this.form.patchValue({
        name: this.project.name,
        description: this.project.description,
        startDate: new Date(this.project.startDate),
        endDate: new Date(this.project.endDate),
        isAddDefaultBoards: this.project.isAddDefaultBoards
      });
    } else if (changes['project'] && this.project === null && this.form) {
      this.form.reset();
    }
  }

  get f() {
    return this.form.controls;
  }

  closeDialog() {
    this.onClose.emit();
  }

  submitForm() {
    if (this.form.invalid || this.form.value.startDate >= this.form.value.endDate) return;

    const isNew = !this.project;

    const payload: ProjectDto = {
      name: this.form.value.name.trim(),
      description: this.form.value.description?.trim(),
      startDate: this.form.value.startDate,
      endDate: this.form.value.endDate,
      statusId: StatusEnum.Pending,
      isAddDefaultBoards: this.form.value.isAddDefaultBoards,
      id: isNew ? 0 : this.project!.id,
    };

    this.onSubmit.emit(payload);
  }
}
