import {Injectable} from '@angular/core';
import {HttpHandler, HttpInterceptor, HttpRequest, HttpEvent, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';
import {catchError} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService,
              private router: Router) {
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.auth.isAuthenticated()) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.auth.token}`,
      });
      req = req.clone({headers});
    }
    return next.handle(req)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.auth.logout();
            this.router.navigate(['/login'], {
              queryParams: {authFailed: true}
            });
          }
          return throwError(error);
        })
      );
  }

}
