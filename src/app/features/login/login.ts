import { NgOptimizedImage, CommonModule, isPlatformServer } from '@angular/common';
import { Component, inject, Inject, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterLink, Router, RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PLATFORM_ID } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { customEmailValidator } from '../../shared/validators/email.validtor';
import { isAuthenticated } from '../../stores/user-store/current-user.selectors';
import { AuthService } from '../../services/auth/auth-service';
import { ApiResponse, LoginResponseDto } from '../../core/models';
import { LoadingComponent } from '../common/loading-component/loading-component';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NgOptimizedImage,
    ReactiveFormsModule,
    RouterOutlet,
    LoadingComponent,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  store = inject(Store);
  loginForm!: FormGroup;
  isLoading: WritableSignal<boolean> = signal(false);
  errorMessage = '';

  isServer = false;
  isAuthenticated$!: Observable<boolean>;

  fb: FormBuilder = inject(FormBuilder);
  authService: AuthService = inject(AuthService);
  // socialAuthService: SocialAuthService = inject(SocialAuthService);

  router: Router = inject(Router);

  platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    this.isServer = isPlatformServer(this.platformId);
    this.isAuthenticated$ = this.store.select(isAuthenticated);

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, customEmailValidator()]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // this.socialAuthService.authState.subscribe((user: SocialUser)  => {
    //   if(user){
    //     console.log('Logged in user: ', user);
    //     this.authService.sendTokenToBackend(user.idToken, user.authToken)
    //   } 
    // })
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.errorMessage = '';

      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: (response: ApiResponse<LoginResponseDto>) => {
          this.isLoading.set(false);
          if (response.succeeded) {
            this.router.navigate(['dashboard']);
          } else {
            this.errorMessage = response.errors.join(', ') || 'Login failed';
          }
        },
        error: (error: any) => {
          this.isLoading.set(false);
          this.errorMessage = error.error?.message || 'An error occurred during login';
          console.error('Login error:', error);
        }
      });
    } else {
      this.markFormGroupTouched(this.loginForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  // onGoogleLogin(): void {
  //   // Implement Google login
  //   console.log('Google login clicked');

  //   this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  // }

  onGithubLogin(): void {
    // Implement GitHub login
    console.log('GitHub login clicked');
  }
}