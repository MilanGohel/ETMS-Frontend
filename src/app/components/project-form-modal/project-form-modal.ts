import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { dateRangeValidator } from '../../shared/validators/dateRange.validator';
import { CreateProjectDto, ProjectDto } from '../../core/models';
import { DatePicker } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-project-form-modal',
  templateUrl: './project-form-modal.html',
  styleUrls: ['./project-form-modal.css'],
  imports: [DatePicker, DialogModule, ReactiveFormsModule]
})
export class ProjectFormModal implements OnChanges {
  @Input() visible = false;
  @Input() project: ProjectDto | null = null;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSubmit = new EventEmitter<CreateProjectDto | ProjectDto>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/\S+/)]],
      description: [''],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
    }, { validators: dateRangeValidator });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['project'] && this.project) {
      this.form.patchValue({
        name: this.project.name,
        description: this.project.description,
        startDate: this.project.startDate,
        endDate: this.project.endDate
      });
    }

    if (changes['visible'] && !this.visible) {
      this.form.reset();
    }
  }


  public get startDate() {
    return this.form.get('startDate');
  }
  public get endDate() {
    return this.form.get('endDate');
  }


  submitForm() {
    if (this.form.valid) {
      const payload = { ...this.project, ...this.form.value };
      this.onSubmit.emit(payload);
    } else {
      this.form.markAllAsTouched();
    }
  }

  closeDialog() {
    this.onClose.emit();
  }
}
