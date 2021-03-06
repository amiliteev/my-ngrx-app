import {Component, OnInit} from '@angular/core';
import {Select} from 'ngrx-actions';
import {Observable} from 'rxjs';
import {LinkType, ProductLink} from '../api/protos';
import {MatTableDataSource, MatDialog} from '@angular/material';
import {Store} from '@ngrx/store';
import {DeleteProductLink, FetchProductLinks, UpdateProductLink, ActionA, ActionB} from '../state/config/config.actions';
import { NewProductLinkComponent } from './new-product-link.component';
import { FetchGaAccountHeaders } from '../state/analytics/analytics.actions';
import { MultiAction, UiEventAction, ShowSnackBar } from '../state/shared/shared.actions';

@Component({
  selector: 'app-product-linking',
  templateUrl: './product-linking.container.html',
  styleUrls: ['./product-linking.container.css']
})
export class ProductLinkingContainerComponent implements OnInit {

  readonly PRODUCT_LINKING_PAGE = 'PRODUCT_LINKING_PAGE';

  @Select(({config}) => config.productLinks)
  productLinks$: Observable<ProductLink[]>;

  dataSource: MatTableDataSource<ProductLink>;

  readonly LinkType = LinkType;

  constructor(private readonly store: Store<any>, private readonly dialog: MatDialog) {
    this.productLinks$.subscribe((productLinks) => {
      this.dataSource = new MatTableDataSource<ProductLink>(productLinks);
    });
  }

  fetchProductLinks() {
    this.store.dispatch({...new FetchProductLinks(), progressBarKey: this.PRODUCT_LINKING_PAGE});
  }

  ngOnInit() {
    this.fetchProductLinks();
  }

  toggleEnabled(productLink: ProductLink) {
    this.store.dispatch(
        new UpdateProductLink({...productLink, enabled: !productLink.enabled}));
  }

  deleteRow(productLink: ProductLink) {
    this.store.dispatch(new DeleteProductLink(productLink));
  }

  addProductLink() {
    this.dialog.open(NewProductLinkComponent).afterClosed().subscribe(((dialogResult) => {
      if (dialogResult) { this.fetchProductLinks(); }
    }));
  }

  actionsForProgressBar(): string[] {
    return [FetchProductLinks.TYPE, UpdateProductLink.TYPE, DeleteProductLink.TYPE];
  }

  multiAction() {
    console.log('launching multi action');
    this.store.dispatch(new MultiAction([new ActionA(), new ActionB()], 
      {onSuccess: new UiEventAction(new ShowSnackBar('Multi action is complete'))}));
  }

}
