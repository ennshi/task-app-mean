import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from "rxjs";

@Injectable({providedIn: 'root'})
export class AvatarService {
  public fallbackUrl = '/assets/images.jpg';
  constructor(private http: HttpClient) {}
  delete():Observable<any> {
    return this.http.delete('/api/users/me/avatar');
  }
  add(image):Observable<any> {
    return this.http.post('/api/users/me/avatar', image);
  }
}
