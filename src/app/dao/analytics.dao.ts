import {QueryEntities} from "../state/entities/entities.actions";
import {getEntityState, EntityState, getEntities, EntitySet, findEntityByKey} from "../state/entities/entities.reducer";
import {ConfigService} from "../config.service";
import { GaAccountHeader, ProductLink, GaProperty } from "../api/protos";
import { Injectable } from "@angular/core";
import { createSelector, Store } from "@ngrx/store";
import { AnalyticsService } from "../analytics.service";
import { RequestOptions } from "../state/shared/shared.actions";
import { AppState } from "../app.module";
import { AnalyticsMethods } from "../state/entities/entities.effects";
import { getAccountKey } from "../state/entities/keys/ga-account-header.key";
import { EntityType } from "../state/entities/keys/common";

@Injectable()
export class AnalyticsDao {

  constructor(private readonly store: Store<AppState>, private readonly analyticsService: AnalyticsService) {}

  listGaAccountHeaders(options: RequestOptions): QueryEntities<GaAccountHeader> {
    return new QueryEntities(EntityType.GA_ACCOUNT_HEADER, { ...options,
      method: AnalyticsMethods.GET_ACCOUNT_HEADERS,
      cacheMaxAge: 10,
    });
  }

  fetchGaProperties(account: GaAccountHeader, options: RequestOptions): QueryEntities<GaProperty> {
    return new QueryEntities(EntityType.GA_PROPERTY, { ...options,
      method: AnalyticsMethods.GET_ACCOUNT_PROPERTIES,
      parameters: [account.accountId],
      path: [getAccountKey(account)],
      cacheMaxAge: 1000
    });
  }

  static getGaAccountHeadersEntitySet = createSelector(getEntityState, 
    (state) => state.entitySetByType[EntityType.GA_ACCOUNT_HEADER]);

  static getGaAccountHeaders = createSelector(AnalyticsDao.getGaAccountHeadersEntitySet, 
    (entitySet) => <GaAccountHeader[]>getEntities(entitySet));

}
