import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { routes } from './app/app.routes';
import { LoginComponent } from './app/auth/login/login';
import { App } from './app/app';
import { AuthInterceptor } from './app/core/interceptors/auth-interceptor';


bootstrapApplication(App, {
  providers: [
    provideHttpClient(withInterceptorsFromDi()), 
    provideRouter(routes),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } 
  ]
}).catch(console.error);
