import { NgOptimizedImage, CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, Router, RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoginRequestDto, LoginResponseDto, ApiResponse } from '../core/models';
import { AuthService } from '../services/auth/auth-service';
import { customEmailValidator } from '../shared/validators/email.validtor';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink, 
    NgOptimizedImage, 
    ReactiveFormsModule,
    RouterOutlet
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, customEmailValidator()]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const { email, password } = this.loginForm.value;
      
      this.authService.login(email, password).subscribe({
        next: (response: ApiResponse<LoginResponseDto>) => {
          this.isLoading = false;
          if (response.succeeded) {
            this.router.navigate(['/dashboard']);
          } else {
            this.errorMessage = response.errors.join(', ') || 'Login failed';
          }
        },
        error: (error:any) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'An error occurred during login';
          console.error('Login error:', error);
        }
      });
    } else {
      this.markFormGroupTouched(this.loginForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  onGoogleLogin(): void {
    // Implement Google login
    console.log('Google login clicked');
  }

  onGithubLogin(): void {
    // Implement GitHub login
    console.log('GitHub login clicked');
  }
}