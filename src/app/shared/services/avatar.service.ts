import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Subject, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class AvatarService {
  public fallbackUrl = '/assets/images.jpg';
  public errorAvatar$: Subject<string> = new Subject<string>();
  constructor(private http: HttpClient) {}
  delete() {
    return this.http.delete('/api/users/me/avatar');
  }
  add(image: any) {
    return this.http.post('/api/users/me/avatar', image)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }
  private handleError(error: HttpErrorResponse) {
    if (error.status === 400) {
      this.errorAvatar$.next('Please add an avatar (jpg, jpeg or png) and smaller than 1MB');
    }
    return throwError(error);
  }
}
