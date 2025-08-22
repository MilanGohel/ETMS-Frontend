import { Component, OnInit, effect, inject, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CurrentUserStateStore } from '../../shared/store/user-store/current-user.state';
import { UserDto } from '../../shared/models/user.model';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, ReactiveFormsModule, ButtonModule],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  currentUserState = inject(CurrentUserStateStore);

  profileForm!: FormGroup;
  isEditing = false;

  // A signal to manage loading state for API calls
  isSaving = signal(false);

  constructor() {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      // Username is not editable in this version for safety
      userName: [{ value: '', disabled: true }],
      profileUrl: ['']
    });

    // React to user state changes to populate the form
    effect(() => {
      const user = this.currentUserState.user();
      if (user) {
        this.populateForm(user);
      }
    });
  }

  ngOnInit(): void {
    // Initial population in case the user data is already in the store
    const user = this.currentUserState.user();
    if (user) {
      this.populateForm(user);
    }
  }

  private populateForm(user: UserDto): void {
    this.profileForm.reset({
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      profileUrl: user.profileUrl
    });
  }

  enterEditMode(): void {
    this.isEditing = true;
  }

  cancelEdit(): void {
    const user = this.currentUserState.user();
    if (user) {
      this.populateForm(user); // Reset form to original data
    }
    this.isEditing = false;
  }

  onProfileImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) {
      return;
    }

    const file = input.files[0];
    console.log('File selected:', file.name);
    // **TODO**: Implement file upload service here.
    // 1. Show a loading indicator on the profile image.
    // 2. Call a service to upload the file to your server.
    // 3. On success, the server returns a new URL.
    // 4. Patch the form and update the state with the new URL.
    // Example optimistic update with FileReader for preview:
    const reader = new FileReader();
    reader.onload = () => {
      const previewUrl = reader.result as string;
      this.profileForm.patchValue({ profileUrl: previewUrl });
      this.profileForm.markAsDirty(); // Mark form as changed
    };
    reader.readAsDataURL(file);
  }

  saveProfile(): void {
    if (this.profileForm.invalid || !this.profileForm.dirty) {
      return;
    }

    this.isSaving.set(true);

    const updatedProfileData = this.profileForm.getRawValue();

    console.log('Saving profile...', updatedProfileData);
    // **TODO**: Call your API service to save the data.
    // this.userService.updateProfile(updatedProfileData).subscribe({
    //   next: (updatedUser) => {
    //     this.currentUserState.setCurrentUser(updatedUser);
    //     this.isSaving.set(false);
    //     this.isEditing = false;
    //     // Optionally show a success toast message
    //   },
    //   error: (err) => {
    //     console.error('Failed to save profile', err);
    //     this.isSaving.set(false);
    //     // Optionally show an error toast message
    //   }
    // });

    // Simulating API call for demonstration
    setTimeout(() => {
      const currentUser = this.currentUserState.user();
      if (currentUser) {
        const updatedUser = { ...currentUser, ...updatedProfileData };
        this.currentUserState.setCurrentUser(updatedUser);
      }
      this.isSaving.set(false);
      this.isEditing = false;
      this.profileForm.markAsPristine();
    }, 1000);
  }
}