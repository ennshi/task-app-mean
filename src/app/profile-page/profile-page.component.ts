import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../shared/services/user.service';
import {User} from '../shared/interfaces/user';
import {Subscription} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AvatarService} from '../shared/services/avatar.service';
import {AlertService} from '../shared/services/alert.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit, OnDestroy {
  user: User;
  pSub: Subscription;
  form: FormGroup;
  avatarForm: FormGroup;
  name: string;
  email: string;
  submitted: boolean;
  changeAvatar = false;
  avatarUrl: string;
  newAvatar: any;
  hideAvatar = false;
  imgPattern = new RegExp('.(jpg|jpeg|png)$', 'i');
  constructor(public userService: UserService,
              public avatar: AvatarService,
              public alert: AlertService,
              public router: Router) { }

  ngOnInit() {
    this.pSub = this.userService.get().subscribe( user => {
      this.user = user;
      this.name = user.name;
      this.email = user.email;
      this.avatarUrl = `/api/users/${(user._id).toString()}/avatar`;
      this.avatarForm = new FormGroup({
        avatarImg: new FormControl(null, [Validators.required, Validators.pattern(this.imgPattern)])
      });
      this.form = new FormGroup({
        name: new FormControl(null, [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
          this.noWhitespaceValidator]),
        email: new FormControl(null, [Validators.email, Validators.required]),
        password: new FormControl(null, [
          Validators.required,
          Validators.minLength(9),
          Validators.maxLength(20),
          this.noWhitespaceValidator])
      });
    });
  }
  ngOnDestroy() {
    if (this.pSub) {
      this.pSub.unsubscribe();
    }
  }
  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }
  submit() {
    const user: User = {
      name: this.user.name,
      email: this.user.email,
      password: this.user.password
    };
    if (this.form.invalid) {
      return;
    }
    this.userService.update(user)
      .subscribe(() => {
        this.submitted = false;
        this.name = this.user.name;
        this.email = this.user.email;
        localStorage.setItem('username', this.user.name);
        this.reset();
        this.alert.display('Profile successfully updated');
      }, () => {
        this.submitted = false;
      });
  }
  reset() {
    this.form.reset({name: this.name, email: this.email, password: ''});
  }
  delete() {
    const answer = confirm('Are you sure you want to delete your account?');
    if (answer) {
      this.userService.delete()
        .subscribe(() => {
          this.router.navigate(['/']);
          localStorage.clear();
          this.alert.display('Profile successfully deleted');
        });
    }
  }
  logoutAll() {
    this.userService.logoutAll();
  }
  showForm() {
    this.changeAvatar = !this.changeAvatar;
  }
  fallbackImage() {
    this.avatarUrl = this.avatar.fallbackUrl;
  }
  selectImg(event) {
    if (event.target.files.length) {
      const file = event.target.files[0];
      this.newAvatar = file;
    }
  }
  addAvatar() {
    const formData = new FormData();
    formData.append('avatar', this.newAvatar);
    this.avatar.add(formData)
      .subscribe(() => {
        this.hideAvatar = true;
        this.avatarForm.reset();
        this.avatarUrl = `/api/users/${(this.user._id).toString()}/avatar?new`;
        this.hideAvatar = false;
        this.showForm();
      }, () => {
        this.hideAvatar = false;
      });
  }
  deleteAvatar() {
    this.avatar.delete()
      .subscribe(() => {
        this.fallbackImage();
      });
  }
  resetAvatarForm() {
    this.avatarForm.reset();
  }
}
