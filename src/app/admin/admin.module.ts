import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {AdminLayoutComponent} from './shared/admin-layout/admin-layout.component';
import {UsersPageComponent} from './users-page/users-page.component';
import { UserComponent } from './shared/user/user.component';
import {SharedModule} from '../shared/shared.module';
import {RoleGuard} from './shared/services/role.guard';
import {AuthService} from '../shared/services/auth.service';
import {SharedcomsModule} from '../shared/sharedcoms.module';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    UsersPageComponent,
    UserComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SharedcomsModule,
    RouterModule.forChild([
      {
        path: '', component: AdminLayoutComponent, children: [
          {path: '', redirectTo: '/login', pathMatch: 'full'},
          {path: 'users', component: UsersPageComponent, canActivate: [RoleGuard]}
        ]
      }
    ])
  ],
  exports: [RouterModule],
  providers: [RoleGuard, AuthService]
})

export class AdminModule {
}
