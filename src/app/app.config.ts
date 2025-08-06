import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { currentUserReducer } from './stores/current-user.reducer';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { definePreset, palette } from '@primeuix/themes';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { authInterceptor } from './core/interceptors/auth-interceptor';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

const AuraCustomDark = definePreset(Aura, {
  semantic: {
    // 1. Define the primary color based on your --tertiary variable
    primary: palette('{sky}'),
    colorScheme: {

      // We'll keep the original light theme
      light: {
        formField: {
          hoverBorderColor: '{primary.color}'
        },
        surface: {
          0: '#ffffff',
          50: '{zinc.50}',
          100: '{zinc.100}',
          200: '{zinc.200}',
          300: '{zinc.300}',
          400: '{zinc.400}',
          500: '{zinc.500}',
          600: '{zinc.600}',
          700: '{zinc.700}',
          800: '{zinc.800}',
          900: '{zinc.900}',
          950: '{zinc.950}'
        }
      },
      // 2. Define the dark theme based on your CSS variables
      dark: {
        formField: {
          hoverBorderColor: '{primary.color}'
        },
        surface: {
          0: '#ffffff',
          50: '#f1f5f9',
          100: '#e5e7eb',
          200: '#c7c8c9',
          300: '#989a9c',
          400: '#696b6d',
          500: '#4a4c4e',
          600: '#3b3d3f',
          700: '#2c2e30',
          800: '#1d1f20',
          900: '#1a1c1e',
          950: '#131517'
        }
      }
    }
  }
});


export const appConfig: ApplicationConfig = {

  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor]),
      withFetch()
    ),
    provideStore({
      currentUser: currentUserReducer
    }),
    provideAnimations(),
    providePrimeNG({
      theme: {
        preset: AuraCustomDark,
        options: {
          darkModeSelector: true || 'none',
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng'
          }
        },

      },
      zIndex: {
        modal: 1100,    // dialog, sidebar
        overlay: 1000,  // dropdown, overlaypanel
        menu: 1000,     // overlay menus
        tooltip: 1100   // tooltip
      }
    }),

    importProvidersFrom(ToastModule),
    importProvidersFrom(ConfirmPopupModule),
    ConfirmationService,
    MessageService
  ]
};


