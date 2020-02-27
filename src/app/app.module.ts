import { BrowserModule } from '@angular/platform-browser';
import {NgModule, Provider} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import { AppComponent } from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {HashLocationStrategy, LocationStrategy} from "@angular/common";

import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { TasksPageComponent } from './tasks-page/tasks-page.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { TaskComponent } from './shared/components/task/task.component';
import { RegistrationPageComponent } from './registration-page/registration-page.component';
import {SharedModule} from './shared/shared.module';
import {AuthInterceptor} from './shared/services/auth.interceptor';
import {SharedcomsModule} from './shared/sharedcoms.module';

const INTERCEPTOR_PROVIDER: Provider = {
  provide: HTTP_INTERCEPTORS,
  multi: true,
  useClass: AuthInterceptor
};

@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    LoginPageComponent,
    TasksPageComponent,
    ProfilePageComponent,
    HomePageComponent,
    TaskComponent,
    RegistrationPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
    SharedModule,
    SharedcomsModule,
    RouterModule
  ],
  providers: [INTERCEPTOR_PROVIDER, {provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
