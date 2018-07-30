import {Injectable} from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { ConfigService } from '../../config.service';
import { FetchProductLinks, ConfigActionTypes, FetchProductLinksSuccess, UpdateProductLinksSuccess, DeleteProductLinksSuccess, CreateProductLinksSuccess, ActionA, ActionB } from './config.actions';
import { mergeMap, switchMap, catchError, tap, filter } from 'rxjs/operators';
import { RequestSuccess, RequestFailure, RequestAction } from '../shared/shared.actions';
import { CommonEffects } from '../common/common.effects';
import { AppState } from '../../app.module';

@Injectable()
export class ConfigEffects extends CommonEffects {

  constructor(readonly actions$: Actions, store$: Store<AppState>, private configService: ConfigService) {
    super(actions$, store$);
  }

  @Effect()
  fetchProductLinks$: Observable<Action> = 
    this.list(ConfigActionTypes.FETCH_PRODUCT_LINKS, this.configService.getProductLinks, FetchProductLinksSuccess);

  @Effect()
  updateProductLink$: Observable<Action> = 
    this.modify(ConfigActionTypes.UPDATE_PRODUCT_LINK, this.configService.updateProductLink, UpdateProductLinksSuccess);

  @Effect()
  deleteProductLink$: Observable<Action> = 
    this.modify(ConfigActionTypes.DELETE_PRODUCT_LINK, this.configService.deleteProductLink, DeleteProductLinksSuccess);

  @Effect()
  createProductLink$: Observable<Action> = 
    this.modify(ConfigActionTypes.CREATE_PRODUCT_LINK, this.configService.createProductLink, CreateProductLinksSuccess);

  @Effect()
  multiAction$: Observable<Action>  =
    this.actions$.pipe(
      filter((action) => action instanceof ActionA || action instanceof ActionB),
      mergeMap((action: ActionA | ActionB) => this.configService.doNothingWithDelay().pipe(
        tap((res) => console.log(`Action ${action.type} is complete`)),
        switchMap(res => of(action.postAction.onSuccess)))));
  
}
