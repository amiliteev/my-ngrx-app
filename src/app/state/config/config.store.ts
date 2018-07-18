import {Action, Effect, ofAction, Store} from 'ngrx-actions';
import {concatMap, flatMap, map, mergeMap, switchMap, catchError, tap} from 'rxjs/operators';
import {
  DeleteProductLink, DeleteProductLinksSuccess,
  FetchProductLinks,
  FetchProductLinksSuccess,
  UpdateProductLink,
  UpdateProductLinksSuccess,
  CreateProductLink,
  CreateProductLinksSuccess,
  ActionA,
  ActionB
} from './config.actions';
import {ConfigService} from '../../config.service';
import {ProductLink} from '../../api/protos';
import {Observable, of} from 'rxjs';
import {cacheable, filterFirst} from '../../misc.utils';
import { RequestSuccess, NO_ACTION, RequestFailure } from '../shared/shared.actions';
import { AnalyticsService } from '../../analytics.service';

export interface ConfigState {
  productLinks: ProductLink[];
}

const DEFAULTS: ConfigState = {
  productLinks: []
};

@Store<ConfigState>(DEFAULTS)
export class ConfigStore {

  constructor(private readonly configService: ConfigService) {
  }

  @Action(FetchProductLinksSuccess)
  productLinkFetched(state: ConfigState, action: FetchProductLinksSuccess) {
    console.log('product links fetched.');
    return {
      ...state,
      productLinks: action.productLinks,
    };
  }

  @Action(UpdateProductLinksSuccess)
  productLinkUpdated(state: ConfigState, action: UpdateProductLinksSuccess) {
    console.log('product link updated.');
    return {
      ...state,
      productLinks: state.productLinks.map(
        (productLink) => productLink.accountId === action.payload.accountId &&
        productLink.externalCustomerId === action.payload.externalCustomerId ? action.payload : productLink),
    };
  }

  @Action(DeleteProductLinksSuccess)
  productLinkDeleted(state: ConfigState, action: DeleteProductLinksSuccess) {
    console.log('product link deleted.');
    return {
      ...state,
      productLinks: state.productLinks.filter(
        (productLink) => productLink.accountId !== action.payload.accountId ||
        productLink.externalCustomerId !== action.payload.externalCustomerId),
    };
  }

  @Effect(FetchProductLinks)
  fetchProductLinks(state: ConfigState, action: FetchProductLinks): Observable<any> {
    console.log('fetching product links...');
    return cacheable(action, this.configService.getProductLinks()).pipe(
      switchMap(res => of(new RequestSuccess(action), new FetchProductLinksSuccess(res))),
      catchError(() => of(new RequestFailure(action)))
    );
  }

  @Effect(UpdateProductLink)
  updateProductLinks(state: ConfigState, action: UpdateProductLink): Observable<any> {
    console.log('updating product link...');
    return cacheable(action, this.configService.updateProductLink(action.payload)).pipe(
      switchMap(res => of(new RequestSuccess(action), new UpdateProductLinksSuccess(res))));
  }

  @Effect(DeleteProductLink)
  deleteProductLinks(state: ConfigState, action: DeleteProductLink): Observable<any> {
    console.log('delete product link...');
    return cacheable(action, this.configService.deleteProductLink(action.payload)).pipe(
      switchMap(res => of(new RequestSuccess(action), new DeleteProductLinksSuccess(res))));
  }

  @Effect(CreateProductLink)
  createProductLinks(state: ConfigState, action: CreateProductLink): Observable<any> {
    console.log('creating product link...');
    return cacheable(action, this.configService.createProductLink(action.payload)).pipe(
      switchMap(res => of(new RequestSuccess(action), new CreateProductLinksSuccess(res), 
        action.postAction.onSuccess || NO_ACTION)));
  }

  @Effect(ActionA, ActionB)
  actionA(state: ConfigState, action: ActionA|ActionB): Observable<any> {
    return this.configService.doNothingWithDelay().pipe(
      tap((res) => console.log(`Action ${action.type} is complete`)),
      switchMap((res) => of(action.postAction)));
  }

}
