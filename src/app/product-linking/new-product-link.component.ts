import { Component, OnInit, AfterViewInit, AfterContentInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MatTableDataSource } from '../../../node_modules/@angular/material';
import { Store } from '@ngrx/store';
import { FetchGaAccountHeaders, PreFetchGaProperties, FetchGaProperties } from '../state/analytics/analytics.actions';
import { GaAccountHeader, GaProperty, ProductLink, LinkType } from '../api/protos';
import { Select } from 'ngrx-actions';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SelectAccount, ProductLinkingViewState, SelectProperty } from './product-linking.store';
import { AnalyticsState } from '../state/analytics/analytics.store';
import { CreateProductLink, FetchProductLinks } from '../state/config/config.actions';
import { UiEvent, UiEventAction, ShowSnackBar } from '../state/shared/shared.actions';

enum View {
  ACCOUNTS, 
  PROPERTIES,
}

function gaPropertiesForSelectedAccount(
  productLinkingView: ProductLinkingViewState,
  analytics: AnalyticsState): GaProperty[] 
{
  console.log('gaPropertiesForSelectedAccount');
  if (!productLinkingView.selectedAccountId) { return []; }
  const account = analytics.gaAccountHeaders.find(
    (account) => account.accountId === productLinkingView.selectedAccountId);
  if (!account) { return []; }
  return account.propertyIds.reduce(
    (result, propertyId) => [...result, analytics.gaProperties.get(propertyId)], [])
    .filter((property) => property);
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

  @Select(({shared}) => shared.uiEvent)
  uiEvent$: Observable<UiEvent>;

  @Select(({analytics}) => analytics.gaAccountHeaders)
  gaAccountHeaders$: Observable<GaAccountHeader[]>;

  @Select(({productLinkingView, analytics}) => gaPropertiesForSelectedAccount(productLinkingView, analytics))
  gaProperties$: Observable<GaProperty[]>;

  accountsDataSource: MatTableDataSource<GaAccountHeader>;
  propertiesDataSource: MatTableDataSource<GaProperty>;

  onDestroy$ = new Subject<void>();

  selectedAccount: GaAccountHeader;

  constructor(
    readonly dialogRef: MatDialogRef<NewProductLinkComponent, boolean>,
    readonly store: Store<any>) {
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

  actionsForAccountsProgressBar() {
    return [FetchGaAccountHeaders.TYPE];
  }

  actionsForPropertiesProgressBar() {
    return [FetchGaProperties.TYPE, CreateProductLink.TYPE];
  }

  backToAccounts() {
    this.loadAccounts();
    this.currentView = View.ACCOUNTS;
  }

  accountSelected(account: GaAccountHeader) {
    this.store.dispatch(new SelectAccount(account.accountId));
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
