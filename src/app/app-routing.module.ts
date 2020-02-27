import { NgModule } from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {MainLayoutComponent} from './shared/components/main-layout/main-layout.component';
import {HomePageComponent} from './home-page/home-page.component';
import {LoginPageComponent} from './login-page/login-page.component';
import {TasksPageComponent} from './tasks-page/tasks-page.component';
import {ProfilePageComponent} from './profile-page/profile-page.component';
import {RegistrationPageComponent} from './registration-page/registration-page.component';
import {AuthGuard} from './shared/services/auth.guard';
import {AdminModule} from "./admin/admin.module";


const routes: Routes = [
  {
    path: '', component: MainLayoutComponent, children: [
      {path: '', redirectTo: '/', pathMatch: 'full'},
      {path: '', component: HomePageComponent},
      {path: 'login', component: LoginPageComponent},
      {path: 'registration', component: RegistrationPageComponent},
      {path: 'tasks', component: TasksPageComponent, canActivate: [AuthGuard]},
      {path: 'profile', component: ProfilePageComponent, canActivate: [AuthGuard]}
    ]
  },
  {
    path: 'admin', loadChildren: () => AdminModule
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
