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
import {ProductLinkingEffects} from './product-linking/product-linking.effects';
import {EffectsModule} from '@ngrx/effects';
import { AnalyticsService } from './analytics.service';
import { sharedReducer, SHARED_STATE, SharedState } from './state/shared/shared.reducer';
import { SharedEffects } from './state/shared/shared.effects';
import { PRODUCT_LINKING_STATE, productLinkingReducer } from './product-linking/product-linking.state';
import { EntityState, ENTITY_STATE, entityReducer } from './state/entities/entities.reducer';
import { EntitiesEffects } from './state/entities/entities.effects';

export interface AppState {
  [ENTITY_STATE]: EntityState,
  [SHARED_STATE]: SharedState,
}

export const reducers: ActionReducerMap<any> = {
  [ENTITY_STATE]: entityReducer,
  [SHARED_STATE]: sharedReducer,
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
    EffectsModule.forRoot([SharedEffects, EntitiesEffects, ProductLinkingEffects]),
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
