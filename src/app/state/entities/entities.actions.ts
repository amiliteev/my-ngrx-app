import {Entity} from '../../misc.utils';
import { RequestAction, WithPayload, RequestOptions, RequestResult } from '../shared/shared.actions';
import {Observable, of} from 'rxjs';
import {Action} from '@ngrx/store'
import { AnalyticsMethods, ConfigMethods } from './entities.effects';
import { EntityType, EntityKey } from './keys/common';

export enum EntityActionTypes {
  GET_ENTITY = '[Entity] Get',
  CREATE_ENTITY = '[Entity] Create',
  UPDATE_ENTITY = '[Entity] Update',
  DELETE_ENTITY = '[Entity] Delete',
  QUERY_ENTITIES = '[Entity] Query',
  ENTITY_SUCCESS = '[Entity] Request Success',
}

export interface EntityAction extends RequestAction {
  entityType: EntityType;
  options: EntityRequestOptions<{}>;
}

export interface EntityRequestOptions<T> extends RequestOptions {
  readonly method: AnalyticsMethods | ConfigMethods,
  readonly parameters?: any[],
  readonly path?: EntityKey[],
  readonly cacheMaxAge?: number,
}

export class GetEntity<T> implements EntityAction {
  readonly type: EntityActionTypes.GET_ENTITY = EntityActionTypes.GET_ENTITY;
  constructor (readonly entityType: EntityType, readonly entityKey: EntityKey, 
    readonly options: EntityRequestOptions<T>) {}
}

export class CreateEntity<T> implements EntityAction {
  readonly type: EntityActionTypes.CREATE_ENTITY = EntityActionTypes.CREATE_ENTITY;
  constructor (readonly entityType: EntityType, readonly options: EntityRequestOptions<T>) {}
}

export class UpdateEntity<T> implements EntityAction {
  readonly type: EntityActionTypes.UPDATE_ENTITY = EntityActionTypes.UPDATE_ENTITY;
  constructor (readonly entityType: EntityType, readonly options: EntityRequestOptions<T>) {}
}

export class DeleteEntity<T> implements EntityAction {
  readonly type: EntityActionTypes.DELETE_ENTITY = EntityActionTypes.DELETE_ENTITY;
  constructor (readonly entityType: EntityType, readonly options: EntityRequestOptions<T>) {}
}

export class QueryEntities<T> implements RequestAction, EntityAction {
  readonly type: EntityActionTypes.QUERY_ENTITIES = EntityActionTypes.QUERY_ENTITIES;
  constructor (readonly entityType: EntityType, 
    readonly options: EntityRequestOptions<T>) {}
}

export class EntitySuccess implements Action, RequestResult {
  readonly type: EntityActionTypes.ENTITY_SUCCESS = EntityActionTypes.ENTITY_SUCCESS;
  constructor (readonly forAction: EntityAction, 
    readonly payload: any, readonly isCachedData?: boolean) {}
}

export type EntityActionUnion = GetEntity<{}> | CreateEntity<{}> | UpdateEntity<{}> | DeleteEntity<{}> | 
  QueryEntities<{}> | EntitySuccess;

