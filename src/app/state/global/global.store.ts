import {Action, Effect, ofAction, Store} from 'ngrx-actions';
import {concatMap, flatMap, map, mergeMap, switchMap} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Actions} from '@ngrx/effects';
import {
  DeleteProductLink, DeleteProductLinksSuccess,
  FetchProductLinks,
  FetchProductLinksSuccess,
  RequestAction,
  RequestSuccess,
  UpdateProductLink,
  UpdateProductLinksSuccess
} from './global.actions';
import {ConfigService} from '../../config.service';
import {ProductLink} from '../../api/protos';
import {Observable, of} from 'rxjs';
import {cacheable, filterFirst} from '../../misc.utils';

export interface GlobalState {
  actionsProcessing: string[];
  productLinks: ProductLink[];
}

const DEFAULTS: GlobalState = {
  actionsProcessing: [],
  productLinks: []
};

@Store<GlobalState>(DEFAULTS)
export class GlobalStore {

  constructor(private readonly configService: ConfigService) {
  }

  @Action(FetchProductLinks, UpdateProductLink, DeleteProductLink)
  startActionProcessing(state: GlobalState, action: RequestAction) {
    console.log('about to make request...');
    return {
      ...state,
      actionsProcessing: [...state.actionsProcessing, action.type]
    };
  }

  @Action(RequestSuccess)
  finishActionProcessing(state: GlobalState, action: RequestSuccess) {
    console.log('request successful.');
    return {
      ...state,
      actionsProcessing: filterFirst(state.actionsProcessing, (s) => s === action.forAction.type)
    };
  }

  @Action(FetchProductLinksSuccess)
  productLinkFetched(state: GlobalState, action: FetchProductLinksSuccess) {
    console.log('product links fetched.');
    return {
      ...state,
      productLinks: action.productLinks,
    };
  }

  @Action(UpdateProductLinksSuccess)
  productLinkUpdated(state: GlobalState, action: UpdateProductLinksSuccess) {
    console.log('product link updated.');
    return {
      ...state,
      productLinks: state.productLinks.map(
        (productLink) => productLink.accountId === action.payload.accountId &&
        productLink.externalCustomerId === action.payload.externalCustomerId ? action.payload : productLink),
    };
  }

  @Action(DeleteProductLinksSuccess)
  productLinkDeleted(state: GlobalState, action: DeleteProductLinksSuccess) {
    console.log('product link deleted.');
    return {
      ...state,
      productLinks: state.productLinks.filter(
        (productLink) => productLink.accountId !== action.payload.accountId ||
        productLink.externalCustomerId !== action.payload.externalCustomerId),
    };
  }

  @Effect(FetchProductLinks)
  fetchProductLinks(state: GlobalState, action: FetchProductLinks): Observable<any> {
    console.log('fetching product links...');
    return cacheable(action, this.configService.getProductLinks()).pipe(
      switchMap(res => of(new RequestSuccess(action), new FetchProductLinksSuccess(res))));
  }

  @Effect(UpdateProductLink)
  updateProductLinks(state: GlobalState, action: UpdateProductLink): Observable<any> {
    console.log('updating product link...');
    return cacheable(action, this.configService.updateProductLink(action.payload)).pipe(
      switchMap(res => of(new RequestSuccess(action), new UpdateProductLinksSuccess(res))));
  }

  @Effect(DeleteProductLink)
  deleteProductLinks(state: GlobalState, action: DeleteProductLink): Observable<any> {
    console.log('delete product link...');
    return cacheable(action, this.configService.deleteProductLink(action.payload)).pipe(
      switchMap(res => of(new RequestSuccess(action), new DeleteProductLinksSuccess(res))));
  }

}
