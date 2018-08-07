import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Observable, of, empty } from "rxjs";
import { Action, Store } from "@ngrx/store";
import { map, mergeMap, withLatestFrom, filter, switchMap, catchError } from "rxjs/operators";
import { AppState } from "../../app.module";
import {EntityActionTypes, GetEntity, EntitySuccess, QueryEntities, EntityAction} from "./entities.actions";
import { RequestFailure, isWithOptions, NO_ACTION } from "../shared/shared.actions";
import { AnalyticsService } from "../../analytics.service";
import { ConfigService } from "../../config.service";
import { EntityState, EntitySet, ENTITY_STATE, getEntities } from "./entities.reducer";
import { EntityKey, EntityType } from "./keys/common";

export enum AnalyticsMethods {
  GET_ACCOUNT_HEADERS = 'analyticsService.getAccountHeaders',
  GET_ACCOUNT_PROPERTIES = 'analyticsService.getAccountProperties',
}

export enum ConfigMethods {
  GET_PRODUCT_LINK = 'configService.getProductLink',
  CREATE_PRODUCT_LINK = 'configService.createProductLink',
  UPDATE_PRODUCT_LINK = 'configService.updateProductLink',
  DELETE_PRODUCT_LINK = 'configService.deleteProductLink',
  QUERY_PRODUCT_LINKS = 'configService.getProductLinks',
}


export function findEntityState(entityState: EntityState, path: EntityKey[]): EntityState {
  if (!path || !path.length) { return entityState; }
  if (!entityState) { return null; }
  const entitySet = entityState.entitySetByType[path[0].type];
  if (!entitySet) { return null; }
  const entityData = entitySet.entityByKey[path[0].toStringKey()];
  if (path.length === 1) {
    return entityData.children;
  } else {
    return findEntityState(entityData.children, path.slice(1));
  }
}

export function findEntity(entityState: EntityState, path: EntityKey[], entityKey: EntityKey) {
  const entitySet = findEntitySet(entityState, path, entityKey.type);
  return entitySet ? entitySet.entityByKey[entityKey.toStringKey()] : null;
}

export function findEntitySet(entityState: EntityState, path: EntityKey[], entityType: EntityType): EntitySet<{}> {
  const parentEntityState = findEntityState(entityState, path);
  return parentEntityState ? parentEntityState.entitySetByType[entityType] : null;
}

@Injectable()
export class EntitiesEffects {

  constructor(private readonly actions$: Actions, private readonly store$: Store<AppState>, 
    private readonly analyticsService: AnalyticsService, 
    private readonly configService: ConfigService) {}

  getFunction(method: AnalyticsMethods|ConfigMethods, parameters: any[]): () => Observable<{}> {
    switch (method) {
      // Analytics methods
      case AnalyticsMethods.GET_ACCOUNT_HEADERS: 
       return () => this.analyticsService.getAccountHeaders();
      case AnalyticsMethods.GET_ACCOUNT_PROPERTIES: 
        return () => this.analyticsService.getAccountProperties(parameters[0]);
      // Config methods
      case ConfigMethods.CREATE_PRODUCT_LINK: 
        return () => this.configService.createProductLink(parameters[0]);
      case ConfigMethods.UPDATE_PRODUCT_LINK: 
        return () => this.configService.updateProductLink(parameters[0]);
      case ConfigMethods.DELETE_PRODUCT_LINK: 
        return () => this.configService.deleteProductLink(parameters[0]);
      case ConfigMethods.GET_PRODUCT_LINK: 
        return () => this.configService.getProductLink(parameters[0]);
      case ConfigMethods.QUERY_PRODUCT_LINKS: 
        return () => this.configService.getProductLinks();
    }
  }

  @Effect()
  asyncFunc$: Observable<Action> = 
    this.actions$.pipe(
      ofType<EntityAction>
        (EntityActionTypes.CREATE_ENTITY, 
         EntityActionTypes.UPDATE_ENTITY, 
         EntityActionTypes.DELETE_ENTITY, 
         EntityActionTypes.GET_ENTITY, 
         EntityActionTypes.QUERY_ENTITIES),
      withLatestFrom(this.store$),
      mergeMap((([action, state]) => {
        if (action.options.cacheMaxAge) {
          if (action.type === EntityActionTypes.GET_ENTITY) {
            const entityData = findEntity(state[ENTITY_STATE], 
              action.options.path, (<GetEntity<{}>>action).entityKey);
            if (entityData && entityData.timestamp > new Date().getTime() - action.options.cacheMaxAge * 1000) {
              return of(new EntitySuccess(action, entityData.data, true /* isCachedData */), 
                action.options.onSuccess ? action.options.onSuccess : NO_ACTION);
            }
          } else if (action.type === EntityActionTypes.QUERY_ENTITIES) {
            const entitySet = findEntitySet(state[ENTITY_STATE], 
              action.options.path, (<QueryEntities<{}>>action).entityType);
            if (entitySet && entitySet.timestamp > new Date().getTime() - action.options.cacheMaxAge * 1000) {
              return of(new EntitySuccess(action, getEntities(entitySet), true /* isCachedData */), 
                action.options.onSuccess ? action.options.onSuccess : NO_ACTION);
            }
          }

        };
        return this.getFunction(action.options.method, action.options.parameters).call(this).pipe(
          switchMap(res => 
            of(new EntitySuccess(action, res), 
               action.options.onSuccess ? action.options.onSuccess : NO_ACTION)),
          catchError(() => of(new RequestFailure(action))))
      })));

}