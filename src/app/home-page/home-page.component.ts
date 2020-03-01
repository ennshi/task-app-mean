import { Component, OnInit } from '@angular/core';
import {AuthService} from '../shared/services/auth.service';
import {TaskService} from '../shared/services/task.service';
import {Subscription} from 'rxjs';
import { TaskNum } from '../shared/interfaces/task';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  constructor(public auth: AuthService,
              public taskService: TaskService) { }
  isAuth = !!this.auth.token;
  tasksNoncompleted = 0;
  tasksUrgent = 0;
  pSub: Subscription;
  ngOnInit() {
    if (this.isAuth) {
      this.pSub = this.taskService.getNumTasks().subscribe((result: TaskNum) => {
        this.tasksNoncompleted = result.noncompleted;
        this.tasksUrgent = result.urgent;
      });
    }
  }
}
