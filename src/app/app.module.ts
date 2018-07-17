import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {MaterialModule} from './material.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ConfigService} from './config.service';
import {NgrxActionsModule} from 'ngrx-actions';
import {SharedStore} from './state/shared/shared.store';
import {ConfigStore} from './state/config/config.store';
import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import { environment } from '../environments/environment'; // Angular CLI environemnt

import {ProductLinkingModule} from './product-linking/product-linking.module';
import {EffectsModule} from '@ngrx/effects';
import { AnalyticsStore } from './state/analytics/analytics.store';
import { AnalyticsService } from './analytics.service';
import { ProductLinkingViewStore } from './product-linking/product-linking.store';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    BrowserAnimationsModule,
    StoreModule.forRoot({}),
    NgrxActionsModule.forRoot({
      shared: SharedStore,
      config: ConfigStore,
      analytics: AnalyticsStore,
      productLinkingView: ProductLinkingViewStore
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
    ProductLinkingModule,
  ],
  providers: [AnalyticsService, ConfigService, SharedStore, ConfigStore, AnalyticsStore],
  bootstrap: [AppComponent]
})
export class AppModule {


}
