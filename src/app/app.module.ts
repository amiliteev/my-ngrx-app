import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {MaterialModule} from './material.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ConfigService} from './config.service';
import {NgrxActionsModule} from 'ngrx-actions';
import {GlobalStore} from './state/global/global.store';
import {StoreModule} from '@ngrx/store';
import {ProductLinkingModule} from './product-linking/product-linking.module';
import {EffectsModule} from '@ngrx/effects';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    BrowserAnimationsModule,
    StoreModule.forRoot({}),
    // EffectsModule.forRoot([]),
    NgrxActionsModule.forRoot({
      global: GlobalStore
    }),
    ProductLinkingModule,
  ],
  providers: [ConfigService, GlobalStore],
  bootstrap: [AppComponent]
})
export class AppModule {


}
