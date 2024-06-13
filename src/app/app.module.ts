import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import localeEsEC from '@angular/common/locales/es-EC';

import {
  HashLocationStrategy,
  LocationStrategy,
  registerLocaleData,
} from '@angular/common';
import { HttpInterceptorService } from './shared/services/http.interceptor.service';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ReactiveFormsModule } from '@angular/forms';
import { DocenteModule } from './docente/docente.module';
import { ResourcesComponent } from './academic-resources/pages/resources/resources.component';
import { ControlModule } from './control/control.module';
import { FlashcardsComponent } from './learn/pages/flashcards/flashcards.component';
import { CardsFlashcardsComponent } from './learn/components/cards-flashcards/cards-flashcards.component';


registerLocaleData(localeEsEC);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    DocenteModule,
    ControlModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true,
    },
    {
      provide: LOCALE_ID,
      useValue: 'es-EC',
    },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
    {
      provide:ResourcesComponent,
      useClass:ResourcesComponent
    },
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
