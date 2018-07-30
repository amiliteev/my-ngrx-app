import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {MaterialModule} from './material.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ConfigService} from './config.service';
import {StoreModule, ActionReducerMap} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import { environment } from '../environments/environment'; // Angular CLI environemnt

import {ProductLinkingModule} from './product-linking/product-linking.module';
import {EffectsModule} from '@ngrx/effects';
import { AnalyticsService } from './analytics.service';
import { sharedReducer, SHARED_STATE, SharedState } from './state/shared/shared.reducer';
import { CONFIG_STATE, configReducer } from './state/config/config.reducer';
import { ConfigEffects } from './state/config/config.effects';
import { SharedEffects } from './state/shared/shared.effects';
import { ANALYTICS_STATE, analyticsReducer, AnalyticsState } from './state/analytics/analytics.reducer';
import { PRODUCT_LINKING_STATE, productLinkingReducer } from './product-linking/product-linking.state';
import { AnalyticsEffects } from './state/analytics/analytics.effects';

export interface AppState {
  [SHARED_STATE]: SharedState,
  [ANALYTICS_STATE]: AnalyticsState
}

export const reducers: ActionReducerMap<any> = {
  [SHARED_STATE]: sharedReducer,
  [CONFIG_STATE]: configReducer,
  [ANALYTICS_STATE]: analyticsReducer,
  [PRODUCT_LINKING_STATE]: productLinkingReducer,
};

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    BrowserAnimationsModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([ConfigEffects, SharedEffects, AnalyticsEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
    ProductLinkingModule,
  ],
  providers: [AnalyticsService, ConfigService],
  bootstrap: [AppComponent]
})
export class AppModule {


}
