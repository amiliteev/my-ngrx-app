import {Injectable} from '@angular/core';
import { CommonEffects } from '../common/common.effects';
import { Actions, Effect } from '@ngrx/effects';
import { AnalyticsService } from '../../analytics.service';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { AnalyticsActionTypes, FetchGaAccountHeadersSuccess, FetchGaProperties, FetchGaPropertiesSuccess, PreFetchGaProperties } from './analytics.actions';
import { AppState } from '../../app.module';

@Injectable()
export class AnalyticsEffects extends CommonEffects {

  constructor(actions$: Actions, store$: Store<AppState>, private analyticsService: AnalyticsService) {
    super(actions$, store$);
  }

  @Effect()
  fetchGaAccountHeaders$: Observable<Action> = 
    this.list(AnalyticsActionTypes.FETCH_GA_ACCOUNT_HEADERS, 
      this.analyticsService.getAccountHeaders, FetchGaAccountHeadersSuccess);

  @Effect() 
  preFetcGaProperties$: Observable<Action> = 
    this.mapAction(AnalyticsActionTypes.PRE_FETCH_GA_PROPERTIES, 
      (action: PreFetchGaProperties, state: AppState) => {
        const fetchGaPropertiesActions = state.analytics.gaAccountHeaders.map(
          (account) => new FetchGaProperties(account.propertyIds));
        return of(...fetchGaPropertiesActions);
      });

  @Effect()
  fetchGaProperties$: Observable<Action> = 
    this.list(AnalyticsActionTypes.FETCH_GA_PROPERTIES, 
      (action: FetchGaProperties) => this.analyticsService.getProperties(action.propertyIds), 
      FetchGaPropertiesSuccess);
    
}