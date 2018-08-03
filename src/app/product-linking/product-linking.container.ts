import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {LinkType, ProductLink} from '../api/protos';
import {MatTableDataSource, MatDialog} from '@angular/material';
import {Store} from '@ngrx/store';
import { NewProductLinkComponent } from './new-product-link.component';
import { MultiAction, UiEventAction, ShowSnackBar } from '../state/shared/shared.actions';
import { ProductLinkDao } from '../dao/product-link.dao';
import { getProductLinkingState, ActionA, ActionB } from './product-linking.state';
import { getProductLinkKey } from '../state/entities/keys/product-link.key';

@Component({
  selector: 'app-product-linking',
  templateUrl: './product-linking.container.html',
  styleUrls: ['./product-linking.container.css']
})
export class ProductLinkingContainerComponent implements OnInit {

  readonly PRODUCT_LINKING_PAGE = 'PRODUCT_LINKING_PAGE';

  productLinks$: Observable<ProductLink[]>;

  dataSource: MatTableDataSource<ProductLink>;

  readonly LinkType = LinkType;

  constructor(private readonly store: Store<{}>, private readonly productLinkDao: ProductLinkDao, 
    private readonly dialog: MatDialog) 
  {
    this.productLinks$ = store.select(ProductLinkDao.getProductLinks);
    this.productLinks$.subscribe((productLinks) => {
      this.dataSource = new MatTableDataSource<ProductLink>(productLinks);
    });
    store.select(ProductLinkDao.getProductLinks).subscribe(x => console.log(x));
  }

  fetchProductLinks() {
    this.store.dispatch(this.productLinkDao.listProductLinks({progressBarKey: this.PRODUCT_LINKING_PAGE}));
  }

  ngOnInit() {
    this.fetchProductLinks();
  }

  toggleEnabled(productLink: ProductLink) {
    this.store.dispatch(this.productLinkDao.updateProductLink({...productLink, enabled: !productLink.enabled}, {
      progressBarKey: this.PRODUCT_LINKING_PAGE
    }));
  }

  deleteRow(productLink: ProductLink) {
    this.store.dispatch(this.productLinkDao.deleteProductLink(productLink, {
      progressBarKey: this.PRODUCT_LINKING_PAGE
    }));
  }

  refreshRow(productLink: ProductLink) {
    console.log('refresh');
    this.store.dispatch(this.productLinkDao.getProductLink(getProductLinkKey(productLink), {
      progressBarKey: this.PRODUCT_LINKING_PAGE
    }));
  }

  addProductLink() {
    this.dialog.open(NewProductLinkComponent);
  }

  multiAction() {
    console.log('launching multi action');
    this.store.dispatch(new MultiAction([new ActionA({}), new ActionB({})], 
      {onSuccess: new UiEventAction(new ShowSnackBar('Multi action is complete'))}));
  }

}
