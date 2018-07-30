import { Component, OnInit, AfterViewInit, AfterContentInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MatTableDataSource } from '../../../node_modules/@angular/material';
import { Store, select } from '@ngrx/store';
import { FetchGaAccountHeaders, PreFetchGaProperties, FetchGaProperties } from '../state/analytics/analytics.actions';
import { GaAccountHeader, GaProperty, ProductLink, LinkType } from '../api/protos';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CreateProductLink, FetchProductLinks } from '../state/config/config.actions';
import { UiEvent, UiEventAction, ShowSnackBar } from '../state/shared/shared.actions';
import * as fromShared from '../state/shared/shared.reducer';
import * as fromAnalytics from '../state/analytics/analytics.reducer';
import * as fromProductLinking from './product-linking.state';

enum View {
  ACCOUNTS, 
  PROPERTIES,
}

class ProductLinkCreated {
  constructor (readonly productLinkName: string) {}
}

@Component({
  selector: 'app-new-product-link',
  templateUrl: './new-product-link.component.html',
  styleUrls: ['./new-product-link.component.css']
})
export class NewProductLinkComponent implements OnInit, OnDestroy {

  readonly SELECT_ACCOUNT = 'SELECT_ACCOUNT';
  readonly SELECT_PROPERTY = 'SELECT_PROPERTY';

  readonly View = View;

  currentView = View.ACCOUNTS;

  readonly uiEvent$: Observable<UiEvent>;
  readonly gaAccountHeaders$: Observable<GaAccountHeader[]>;
  readonly gaProperties$: Observable<GaProperty[]>;

  accountsDataSource: MatTableDataSource<GaAccountHeader>;
  propertiesDataSource: MatTableDataSource<GaProperty>;

  onDestroy$ = new Subject<void>();

  constructor(
    readonly dialogRef: MatDialogRef<NewProductLinkComponent, boolean>,
    readonly store: Store<any>) 
  {
    this.uiEvent$ = this.store.pipe(select(fromShared.getUiEvent));
    this.gaAccountHeaders$ = this.store.pipe(select(fromAnalytics.getGaAccountHeaders));
    this.gaProperties$ = this.store.pipe(select(fromProductLinking.getGaPropertiesForSelectedAccount));

    this.gaAccountHeaders$.pipe(takeUntil(this.onDestroy$)).subscribe((gaAccountHeaders) => {
      this.accountsDataSource = new MatTableDataSource<GaAccountHeader>(gaAccountHeaders);
    });
    this.gaProperties$.pipe(takeUntil(this.onDestroy$)).subscribe((gaProperties) => {
      this.propertiesDataSource = new MatTableDataSource<GaProperty>(gaProperties);
    });
    this.uiEvent$.pipe(takeUntil(this.onDestroy$)).subscribe((uiEvent) => this.handleUiEvent(uiEvent));
  }

  ngOnInit() {
    setTimeout(() => this.loadAccounts());
  }

  private handleUiEvent(uiEvent: UiEvent) {
    if (uiEvent instanceof ProductLinkCreated) {
      this.dialogRef.close(true);
      this.store.dispatch(new UiEventAction(new ShowSnackBar(uiEvent.productLinkName + ' successfully created')));
    }
  }

  private loadAccounts() {
    this.store.dispatch({
      ...new FetchGaAccountHeaders({onSuccess: new PreFetchGaProperties()}), 
      progressBarKey: this.SELECT_ACCOUNT
    });
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  close() {
    console.log('close');
  }

  backToAccounts() {
    this.loadAccounts();
    this.currentView = View.ACCOUNTS;
  }

  accountSelected(account: GaAccountHeader) {
    this.store.dispatch(new fromProductLinking.SelectAccount(account.accountId));
    this.store.dispatch({
      ...new FetchGaProperties(account.propertyIds),
      progressBarKey: this.SELECT_PROPERTY
    });
    this.currentView = View.PROPERTIES;
  }

  propertySelected(property: GaProperty) {
    console.log(property);
    const productLink: ProductLink = {
      accountId: property.accountId,
      enabled: true,
      linkType: LinkType.GA,
      productLinkName: 'Link to ' + property.propertyName,
    }
    this.store.dispatch({
      ...new CreateProductLink(productLink, 
        {onSuccess: new UiEventAction(new ProductLinkCreated(productLink.productLinkName))}),
      progressBarKey: this.SELECT_PROPERTY
    });
  }

}
