import {Component, HostListener, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {
  menuCollapsed: boolean;
  innerWidth: number;
  mobileMenu: boolean;
  constructor(private router: Router,
              public auth: AuthService) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    this.collapseMenu();
  }
  logout(event: Event) {
    event.preventDefault();
    this.auth.logoutOnClick().subscribe(() => {
      this.auth.logout();
      this.router.navigate(['/', 'login']);
    });
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    this.collapseMenu();
  }
  collapseMenu() {
    this.menuCollapsed = this.innerWidth <= 600;
    this.mobileMenu = this.innerWidth <= 600;
  }
}
