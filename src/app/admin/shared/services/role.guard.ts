import {Injectable} from '@angular/core';
import {AuthGuard} from '../../../shared/services/auth.guard';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';

@Injectable ()
export class RoleGuard implements CanActivate {
  constructor(private _authGuard: AuthGuard, private router: Router) {
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> | Observable<boolean> | boolean {
    const auth = this._authGuard.canActivate(route, state);
      if (!auth) {
        return false;
      } else {
       if (this._authGuard.auth.roleAdmin()) {
         return true;
       } else {
         this.router.navigate(['/profile']);
       }
      }
  }

}
