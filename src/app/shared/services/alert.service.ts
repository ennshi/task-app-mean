import {Injectable} from '@angular/core';
import { Subject } from 'rxjs';

export interface Alert {
  text: string;
}
@Injectable({providedIn: 'root'})
export class AlertService {
  public alert$ = new Subject<Alert>();

  display(text: string) {
    this.alert$.next({text});
  }
}
