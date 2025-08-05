import {
  Component,
  inject,
  OnInit,
  PLATFORM_ID,
  signal,
  computed,
} from '@angular/core';
import { AuthService } from '../../services/auth/auth-service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  isPlatformBrowser,
  NgOptimizedImage,
} from '@angular/common';
import { LoadingComponent } from '../common/loading-component/loading-component';

@Component({
  selector: 'app-verify-user.component',
  standalone: true,
  imports: [NgOptimizedImage, LoadingComponent, RouterLink],
  templateUrl: './verify-user.component.html',
  styleUrls: ['./verify-user.component.css']
})
export class VerifyUserComponent implements OnInit {
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private platformId = inject(PLATFORM_ID);

  status = signal<'success' | 'error' | 'pending' | ''>('');
  showLoader = computed(() => this.status() === 'pending' || this.status() === '');

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.status.set('pending');
      this.authService.verifyUser(token).subscribe({
        next: (res) => {
          this.status.set(res.succeeded ? 'success' : 'error');
        },
        error: () => {
          this.status.set('error');
        }
      });
    } else {
      this.status.set('error');
    }
  }
}
