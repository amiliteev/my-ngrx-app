import { Injectable } from "@angular/core";
import { Actions, Effect } from "@ngrx/effects";
import { Store, Action } from "@ngrx/store";
import { AppState } from "../app.module";
import { AnalyticsDao } from "../dao/analytics.dao";
import { Observable, of } from "rxjs";
import { ProductLinkingActionTypes, PreFetchGaProperties, ActionA, ActionB } from "./product-linking.state";
import { CommonEffects } from "../state/common/common.effects";
import { GaAccountHeader } from "../api/protos";
import { getEntities } from "../state/entities/entities.reducer";
import { EntityType } from "../state/entities/keys/common";
import { filter, mergeMap, tap, switchMap } from "rxjs/operators";
import { ConfigService } from "../config.service";

@Injectable()
export class ProductLinkingEffects extends CommonEffects {

  constructor(actions$: Actions, store$: Store<AppState>, 
    private readonly configService: ConfigService,
    private readonly analyticsDao: AnalyticsDao) {
      super(actions$, store$);
    }

  @Effect() 
  preFetchGaProperties$: Observable<Action> = 
    this.mapAction(ProductLinkingActionTypes.PRE_FETCH_GA_PROPERTIES, 
      (action: PreFetchGaProperties, state: AppState) => {
        const fetchGaPropertiesActions = 
          (<GaAccountHeader[]>getEntities(state.entity.entitySetByType[EntityType.GA_ACCOUNT_HEADER])).map(
            (account) => this.analyticsDao.fetchGaProperties(account, {}));
        return of(...fetchGaPropertiesActions);
      });

  @Effect()
  multiAction$: Observable<Action>  =
    this.actions$.pipe(
      filter((action) => action instanceof ActionA || action instanceof ActionB),
      mergeMap((action: ActionA | ActionB) => this.configService.doNothingWithDelay().pipe(
        tap((res) => console.log(`Action ${action.type} is complete`)),
        switchMap(res => of(action.options.onSuccess)))));
      
          
}