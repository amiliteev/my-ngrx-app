import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProductLinkingContainerComponent} from './product-linking.container';
import {GlobalStore} from '../state/global/global.store';
import {StoreModule} from '@ngrx/store';
import {NgrxActionsModule} from 'ngrx-actions';
import {MatTableModule} from '@angular/material';
import {MaterialModule} from '../material.module';

@NgModule({
  imports: [
    CommonModule,
    // StoreModule.forRoot({}),
    // NgrxActionsModule.forRoot({
    //   global: GlobalStore
    // }),
    MaterialModule,
    MatTableModule
  ],
  declarations: [ProductLinkingContainerComponent],
  exports: [ProductLinkingContainerComponent]
})
export class ProductLinkingModule {



}
