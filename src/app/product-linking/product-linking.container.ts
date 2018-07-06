import {Component, OnInit} from '@angular/core';
import {Select} from 'ngrx-actions';
import {Observable} from 'rxjs';
import {LinkType, ProductLink} from '../api/protos';
import {MatTableDataSource} from '@angular/material';
import {Store} from '@ngrx/store';
import {DeleteProductLink, FetchProductLinks, UpdateProductLink} from '../state/global/global.actions';

@Component({
  selector: 'app-product-linking',
  templateUrl: './product-linking.container.html',
  styleUrls: ['./product-linking.container.css']
})
export class ProductLinkingContainerComponent implements OnInit {

  @Select(({global}) => global.productLinks)
  productLinks$: Observable<ProductLink[]>;

  dataSource: MatTableDataSource<ProductLink>;

  readonly LinkType = LinkType;

  constructor(private readonly store: Store<any>) {
    this.productLinks$.subscribe((productLinks) => {
      this.dataSource = new MatTableDataSource<ProductLink>(productLinks);
    });
  }

  fetchProductLinks() {
    this.store.dispatch(new FetchProductLinks());
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
    console.log('add product link');
  }

}
