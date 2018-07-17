import {Store, Action, Effect} from 'ngrx-actions';
import {FetchGaAccountHeaders, FetchGaAccountHeadersSuccess, PreFetchGaProperties, FetchGaProperties, FetchGaPropertiesSuccess} from './analytics.actions';
import {AnalyticsService} from '../../analytics.service';
import {map, switchMap} from 'rxjs/operators';
import {of} from 'rxjs';
import { cacheable } from '../../misc.utils';
import { RequestSuccess, NO_ACTION } from '../shared/shared.actions';
import {GaAccountHeader, GaProperty} from '../../api/protos';

export interface AnalyticsState {
  gaAccountHeaders: GaAccountHeader[];
  gaProperties: Map<number, GaProperty>;
}

const DEFAULTS = {
  gaAccountHeaders: [],
  gaProperties: new Map<number, GaProperty>(),
};

@Store<AnalyticsState>(DEFAULTS)
export class AnalyticsStore {

  constructor(private readonly analyticsServices: AnalyticsService) {
  }

  @Effect(FetchGaAccountHeaders)
  fetchGaAccountHeaders(state: AnalyticsState, action: FetchGaAccountHeaders) {
    console.log('fetching GA account headers...');
    return cacheable(action, this.analyticsServices.getAccountHeaders()).pipe(
      switchMap(res => of(
        new RequestSuccess(action), 
        new FetchGaAccountHeadersSuccess(res),
        action.postAction.onSuccess || NO_ACTION)));
  }

  @Effect(PreFetchGaProperties)
  preFetchGaProperties(state: AnalyticsState, action: PreFetchGaProperties) {
    const fetchGaPropertiesActions = state.gaAccountHeaders.map(
      (account) => new FetchGaProperties(account.propertyIds));
    return of(...fetchGaPropertiesActions);
  }

  @Effect(FetchGaProperties)
  fetchGaProperties(state: AnalyticsState, action: FetchGaProperties) {
    return cacheable(action, this.analyticsServices.getProperties(action.propertyIds)).pipe(
      switchMap(res => of(
        new RequestSuccess(action), 
        new FetchGaPropertiesSuccess(res),
      ))
    );
  }
  
  @Action(FetchGaAccountHeadersSuccess)
  gaAccountHeadersFetched(state: AnalyticsState, action: FetchGaAccountHeadersSuccess) {
    console.log('GA account headers fetched.');
    return {
      ...state,
      gaAccountHeaders: action.gaAccountHeaders,
    };
  }

  @Action(FetchGaPropertiesSuccess)
  gaPropertiesFetched(state: AnalyticsState, action: FetchGaPropertiesSuccess) {
    console.log('GA properties fetched.');
    return {
      ...state,
      gaProperties: action.properties.reduce(
        (result, property) => result.set(property.propertyId, property), new Map(state.gaProperties))
    };
  }

}
