import { ApplicationConfig, importProvidersFrom, Inject, Injectable, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { currentUserReducer } from './stores/user-store/current-user.reducer';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { definePreset, palette } from '@primeuix/themes';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { authInterceptor } from './core/interceptors/auth-interceptor';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { SocialAuthServiceConfig, GoogleLoginProvider, SocialLoginModule } from "@abacritt/angularx-social-login";
import { environment } from '../environments/environment.development';
import { NgxEditorModule } from 'ngx-editor';

const Noir = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{sky.50}',
      100: '{sky.100}',
      200: '{sky.200}',
      300: '{sky.300}',
      400: '{sky.400}',
      500: '{sky.500}',
      600: '{sky.600}',
      700: '{sky.700}',
      800: '{sky.800}',
      900: '{sky.900}',
      950: '{sky.950}'
    },
    colorScheme: {
      light: {
        primary: {
          color: '{sky.950}',
          inverseColor: '#ffffff',
          hoverColor: '{sky.900}',
          activeColor: '{sky.800}'
        },
        highlight: {
          background: '{sky.950}',
          focusBackground: '{sky.700}',
          color: '#ffffff',
          focusColor: '#ffffff'
        }
      },
      dark: {
        primary: {
          color: '{sky.50}',
          inverseColor: '{sky.950}',
          hoverColor: '{sky.100}',
          activeColor: '{sky.200}'
        },
        highlight: {
          background: 'rgba(250, 250, 250, .16)',
          focusBackground: 'rgba(250, 250, 250, .24)',
          color: 'rgba(255,255,255,.87)',
          focusColor: 'rgba(255,255,255,.87)'
        }
      }
    }
  },
  // --- ADD THIS SECTION TO STYLE THE BUTTON ---
  components: {
   
    button: {
      colorScheme: {
        dark: {
          root: {
            primary: {
              background: '#129dfd',
              hoverBackground: '#0a7cd1',
              activeBackground: '#117bccff',
              color: 'white',
              activeColor: 'rgba(255,255,255,0.8)',
              hoverColor: 'rgba(255,255,255,0.9)',
              borderColor: 'transparent',
              hoverBorderColor: 'transparent',
              activeBorderColor: 'transparent',
            },
            secondary: {
              background: 'var(--color-primary-gray)',
              hoverBackground: 'var(--color-primary-light)',
              activeBackground: 'var(--color-primary)',
              color: 'white',
              activeColor: 'rgba(255,255,255,0.8)',
              hoverColor: 'rgba(255,255,255,0.9)',
              borderColor: 'var(--color-primary-light)',
              hoverBorderColor: 'var(--color-primary)',
              activeBorderColor: 'var(--color-secondary)'
            }
          }
        }
        // Add other properties like padding, border-radius etc. if needed
      }
    }
  }
});

const googleClientId = environment.googleClientId;

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(SocialLoginModule),
    importProvidersFrom(
      NgxEditorModule.forRoot({
        locals: {
          // ... all your other correct labels
          bold: 'Bold',
          italic: 'Italic',
          // ... etc.
          text_color: 'Text Color',
          // CORRECTED: This should be a text label
          background_color: 'Background Color',
        }
      }),
    ),
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(googleClientId, { oneTapEnabled: false })
          },
        ],
        onError: (err) => { console.error(err) }
      } as SocialAuthServiceConfig
    },
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
        preset: Noir,
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


