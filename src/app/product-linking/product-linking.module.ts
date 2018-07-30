import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProductLinkingContainerComponent} from './product-linking.container';
import {MatTableModule} from '@angular/material';
import {MaterialModule} from '../material.module';
import { NewProductLinkComponent } from './new-product-link.component';
import { ProgressBarModule } from '../progress-bar/progress-bar.module';
import { StoreModule } from '@ngrx/store';

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
})
export class ProductLinkingModule {



}
