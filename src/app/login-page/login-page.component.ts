import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../shared/services/auth.service';
import {ActivatedRoute, Router, Params} from '@angular/router';
import {User} from '../shared/interfaces/user';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  message: string;

  constructor(public auth: AuthService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      if (params['loginAgain'] || params['authFailed']) {
        this.message = 'Please, login';
      }
    });
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.email, Validators.required]),
      password: new FormControl(null, [Validators.required])
    });
  }

  submit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    const user: User = {
      email: this.form.value.email,
      password: this.form.value.password
    };
    this.auth.login(user).subscribe(() => {
      this.form.reset();
      this.router.navigate(['/', 'tasks']);
      this.submitted = false;
    }, () => {
      this.submitted = false;
    });
  }
}
