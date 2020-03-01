import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable} from "rxjs";
import { Task } from '../interfaces/task';


@Injectable({providedIn: 'root'})
export class TaskService {
  constructor(private http: HttpClient) {
  }
  getAll():Observable<any> {
    return this.http.get('/api/tasks')
      .pipe(map((response: {[key: string]: any}) => {
        return Object
          .keys(response)
          .map( key => ({
            ...response[key]
          }));
      }));
  }
  create(task: Task):Observable<any> {
    return this.http.post('/api/tasks', task);
  }
  update(id: string, task: Task):Observable<any> {
    return this.http.patch(`/api/tasks/${id}`, task);
  }
  delete(id: string):Observable<any> {
    return this.http.delete(`/api/tasks/${id}`);
  }
  getNumTasks() {
    return this.http.get('/api/tasksNumber');
  }
  getPage(page: number, query: string):Observable<any> {
    return this.http.get(`/api/tasks?sortBy=${query}&limit=5&skip=${page * 5}`)
      .pipe(map((response: {[key: string]: any}) => {
        return Object
          .keys(response)
          .map( key => ({
            ...response[key]
          }));
      }));
  }
}
