import {Store, Action, ofAction, Effect} from 'ngrx-actions';
import {AnalyticsState} from './analytics.state';
import {FetchGaAccountHeaders} from './analytics.actions';
import {AnalyticsService} from '../../analytics.service';
import {map, switchMap} from 'rxjs/operators';
import {FetchProductLinks} from '../global/global.actions';
import {Actions} from '@ngrx/effects';
import {Injectable} from '@angular/core';

const DEFAULTS: AnalyticsState = {
  gaAccounts: [],
  gaAccountHeaders: [],
  gaProperties: [],
};

@Store<AnalyticsState>(DEFAULTS)
export class GlobalStore {

  constructor(private readonly analyticsServices: AnalyticsService) {}

  @Action(FetchGaAccountHeaders) fetchGaAccountHeaders(state: AnalyticsState) {
  }

}

// @Injectable()
// export class PizzaEffects {
//   constructor(
//     private actions$: Actions,
//     private analyticsService: AnalyticsService) {}
//
//   @Effect() orderPizza$ = this.actions$.pipe(
//     ofAction(FetchProductLinks),
//     switchMap(productLinks => this.analyticsService.(toppings)),
//     map(res => new OrderPizzaSuccess(res)));
//
// }
