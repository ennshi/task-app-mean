import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from '../../../shared/interfaces/user';
import {UserService} from '../../../shared/services/user.service';
import {AlertService} from '../../../shared/services/alert.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})

export class UserComponent implements OnInit {
  @Input() user: User;
  @Output() removeUser: EventEmitter<string> = new EventEmitter<string>();
  constructor(public userService: UserService,
              public alert: AlertService) { }

  ngOnInit() {
  }
  delete() {
    const id = this.user._id.toString();
    this.userService.deleteByAdmin(id).subscribe(() => {
      this.removeUser.emit(id);
      this.alert.display('User successfully deleted');
    });
  }
}
