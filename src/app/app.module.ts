import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

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
import { NgSelectModule } from '@ng-select/ng-select';
import { ControlModule } from './control/control.module';
import { AcademicResourcesModule } from './academic-resources/academic-resources.module';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { Chart } from 'chart.js';
import {provideCharts, withDefaultRegisterables } from 'ng2-charts';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);

registerLocaleData(localeEsEC);

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    ControlModule,
    DocenteModule,
    NgSelectModule,
    YouTubePlayerModule,  
    
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
    // {
    //   provide: LocationStrategy,
    //   useClass: HashLocationStrategy,
    // },
    {
      provide: ResourcesComponent,
      useClass: ResourcesComponent,
    },
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    provideCharts(withDefaultRegisterables()),
  ],
})
export class AppModule {}
