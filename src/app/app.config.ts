import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth-interceptor';
import { provideStore } from '@ngrx/store';
import { currentUserReducer } from './stores/current-user.reducer';

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
    provideClientHydration(withEventReplay())
  ]
};
