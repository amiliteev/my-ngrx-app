import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProductLinkingContainerComponent} from './product-linking.container';
import {MatTableModule} from '@angular/material';
import {MaterialModule} from '../material.module';
import { NewProductLinkComponent } from './new-product-link.component';
import { ProgressBarModule } from '../progress-bar/progress-bar.module';
import { StoreModule } from '@ngrx/store';
import { ProductLinkDao } from '../dao/product-link.dao';
import { AnalyticsDao } from '../dao/analytics.dao';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    MatTableModule,
    ProgressBarModule,
  ],
  declarations: [ProductLinkingContainerComponent, NewProductLinkComponent],
  exports: [ProductLinkingContainerComponent],
  entryComponents: [NewProductLinkComponent],
  providers: [ProductLinkDao, AnalyticsDao]
})
export class ProductLinkingModule {



}
