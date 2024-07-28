import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanMatch,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
} from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { CardMessageComponent } from '../../shared/pages/card-message/card-message.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanMatch, CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  private checkAuthStatus(
    route?: Route | ActivatedRouteSnapshot
  ): Observable<boolean> {
    return this.authService.checkAuthStatus().pipe(
      map((isAuthenticated) => {
        if (!isAuthenticated) {
          this.router.navigate(['./auth/login']);
          return false;
        }

        if (route) {
          const expectedRoles = route.data?.['roles'] as string[];
          const userRol = this.authService.userRol();
          const hasAccess = expectedRoles.includes(userRol!);

          if (!hasAccess) {
            this.router.navigate(['/home']);
            return false;
          }
        }

        return true;
      })
    );
  }

  canMatch(route: Route, segments: UrlSegment[]): Observable<boolean> {
    return this.checkAuthStatus(route);
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.checkAuthStatus(route);
  }
}
