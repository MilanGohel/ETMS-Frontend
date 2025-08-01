import { NgOptimizedImage } from '@angular/common';
import { Component, inject, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth/auth-service';
import { customEmailValidator } from '../shared/validators/email.validtor';
import { SignUpRequestDto } from '../core/models';
import { userNameValidator } from '../shared/validators/user-name.validator';
import { Message } from "primeng/message";

@Component({
  selector: 'app-signup',
  imports: [NgOptimizedImage,
    RouterLink,
    Message,
    ReactiveFormsModule
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup implements OnInit {
  signUpForm!: FormGroup;
  isLoading = false;
  errorMessage: WritableSignal<string> = signal('');
  successMessage: WritableSignal<string> = signal('');

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, customEmailValidator()]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      userName: ['', [Validators.required, userNameValidator()]]
    })
  }

  get firstName() {
    return this.signUpForm.get('firstName');
  }

  public get lastName() {
    return this.signUpForm.get('lastName');
  }

  public get email() {
    return this.signUpForm.get("email");
  }

  public get password() {
    return this.signUpForm.get('password');
  }

  onSignUp(): void {
    if (this.signUpForm.valid) {
      this.isLoading = true;
      this.errorMessage.set('');

      const signUpRequest = this.signUpForm.value as SignUpRequestDto;

      this.authService.signUp(signUpRequest).subscribe(
        response => {
          if (response.succeeded) {
            this.successMessage.set(response.message);
          }
          else {
            this.errorMessage.set(response.message);
          }
          this.isLoading = false;
        }
      )
    }
  }


}
