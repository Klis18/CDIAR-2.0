import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector, computed, inject, signal } from '@angular/core';
import { Observable, map, catchError, throwError, of, tap } from 'rxjs';
import { User, AuthStatus, LoginResponse } from '../interfaces';
import { EmailVerification } from '../interfaces/email-verification';
import { Login } from '../interfaces/login';
import { HelperHttpService } from '../../shared/services/helper.http.service';
import { Role } from '../interfaces/role';
import { HttpInterceptorService } from '../../shared/services/http.interceptor.service';
import { Email } from '../interfaces/email';
import { ForgotPassword } from '../interfaces/forgot-password';
import { HomeService } from '../../home/services/home.service';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HelperHttpService);
  private injector = inject(Injector); 
  private _currentUser = signal<User | null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);
  private _userRol = signal<string | null>(null);

  public currentUser = computed(() => this._currentUser());
  public authStatus = computed(() => this._authStatus());
  public userRol = computed(() => this._userRol());


  constructor() {
    this.checkAuthStatus().subscribe();
  }

  private setAuthentication(user: User, token: string): boolean {
    this._currentUser.set(user);
    this._authStatus.set(AuthStatus.authenticated);
    localStorage.setItem('token', token);
    this.getRolUser();
    return true;
  }

  private getRolUser() {
    const homeService = this.injector.get(HomeService);
    homeService.obtenerDatosMenu().subscribe((res) => {
      this._userRol.set(res.data.rol);
    });
  }

  login(login: Login): Observable<boolean> {
    return this.http.post<LoginResponse>('login', login).pipe(
      map(({ data }) => {
        if(data) {
          const { user, token} = data;
          return this.setAuthentication(user, token);
        }
        return false;  
      }));
  }

  checkAuthStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.logout();
      return of(false);
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<LoginResponse>('auth/check-token', { headers }).pipe(
      map(({ data: { user, token} }) => this.setAuthentication(user, token)),
      catchError(() => {
        this._authStatus.set(AuthStatus.notAuthenticated);
        return of(false);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this._currentUser.set(null);
    this._authStatus.set(AuthStatus.notAuthenticated);
    this._userRol.set(null);
  }

 

  registrarUsuario(user: User) {
    return this.http.post<User>('usuario/crear', user);
  }

  obtenerRoles() {
    return this.http.get<Role>('usuario/obtenerRoles');
  }


  verifyUser(verification: EmailVerification) {
    return this.http.post<EmailVerification>('login/verifyuser', verification);
  }

  resendVerificationMail(email: Email) {
    return this.http.post<Email>('usuario/resendverificationmail', email);
  }

  forgotPassword(email: Email) {
    return this.http.post<Email>('login/forgotpassword', email);
  }

  resendChangePasswordEmail(email: Email) {
    return this.http.post<Email>('login/resendverificationcode', email);
  }

  resetpassword(email: ForgotPassword) {
    return this.http.post<ForgotPassword>('login/resetpassword', email);
  }

  
}
