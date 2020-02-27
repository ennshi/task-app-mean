import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from '../../shared/interfaces/user';
import {Subscription} from 'rxjs';
import {UserService} from '../../shared/services/user.service';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.scss']
})
export class UsersPageComponent implements OnInit, OnDestroy {
  pSub: Subscription;
  users: User[];
  constructor(public userService: UserService) { }

  ngOnInit() {
    this.pSub = this.userService.getAll().subscribe((response: User[]) => {
      this.users = response;
    });
  }
  ngOnDestroy(): void {
    if (this.pSub) {
      this.pSub.unsubscribe();
    }
  }
  refreshUsers(id: string) {
    this.users = this.users.filter(user => user._id !== id);
  }

}
