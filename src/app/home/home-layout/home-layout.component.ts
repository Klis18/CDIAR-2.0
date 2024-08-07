import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { HomeService } from '../services/home.service';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-home-layout',
  templateUrl: './home-layout.component.html',
  styleUrls: ['./home-layout.component.css'],
})
export class HomeLayoutComponent implements OnInit, OnDestroy {

  mobileQuery: MediaQueryList;
  private authService = inject(AuthService);
  private router = inject(Router);
  userName: string = '';
  rol: string = '';
  foto: string = '';

  private _mobileQueryListener: () => void;
  private homeService = inject(HomeService);

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  
  }

  getFoto(){
    if(this.foto == ''){
      return "assets/images/usuario.png";
    }else{
      return this.foto;
    }
  }

  ngOnInit() {
    this.homeService.obtenerDatosMenu().subscribe((user) => {
      this.userName = user.data.userName;
      this.rol = user.data.rol;
      this.foto = user.data.foto;
    });

    
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  logout() {
    this.authService.logout();
      setTimeout(() => {
        window.location.reload();
      }, 50); 
    this.router.navigate(['/auth/login']);
  }
}
