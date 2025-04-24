import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { GeneralFunctionService } from '../../core/function/general-function.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  // token:any;
  constructor(
    private cookieService: CookieService,
    private router: Router,
    private allFunction: GeneralFunctionService,
    private auth: AuthService
  ) {
   
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
 
    const token = localStorage.getItem('token');
    let authReq = req; // Start with the original request

    if (token) {
      try {
        authReq = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${token}`),
        });
        console.log('token', authReq)
      } catch (error) {
        console.error('Token decryption failed:', error);
      }
    } else {
      // If no token is present, use Basic Auth
      const username = environment.Username;
      const password = environment.Password;
      const basicAuthCredentials = btoa(`${username}:${password}`);
      authReq = req.clone({
        headers: req.headers.set('Authorization', `Basic ${basicAuthCredentials}`),
      });
    }

    // Fallback for default headers (if necessary)
    if (!authReq.headers.has('Authorization')) {
      authReq = authReq.clone({
        headers: authReq.headers.set('Authorization', `Bearer ${environment.base_token}`),
      });
    }

    return next.handle(authReq);
  }
}
