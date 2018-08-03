import { EntityActionUnion, EntityActionTypes, QueryEntities, CreateEntity, UpdateEntity, DeleteEntity, GetEntity } from "./entities.actions";
import { replaceKey } from "../../misc.utils";
import { createFeatureSelector } from "@ngrx/store";
import { getProductLinkKey } from "./keys/product-link.key";
import { getAccountKey } from "./keys/ga-account-header.key";
import { getPropertyKey } from "./keys/ga-property.key";
import { getKeyFactory } from "./keys/key.factory";
import { GetKey, EntityKey, EntityType } from "./keys/common";

export const ENTITY_STATE = 'entity';

export class EntityData<T> {
  readonly timestamp: number = new Date().getTime();
  constructor (readonly data: T, readonly children?: EntityState) {}
}

export interface EntityByKey<T> {
  [key: string]: EntityData<T>;
}

export interface EntitySetByType {
  [key: string]: EntitySet<{}>;
}

export interface EntitySet<T> {
  readonly timestamp: number;
  readonly entityByKey: EntityByKey<T>;
}

export function createEntitySet<T>(entities: T[], getKey: GetKey<T>) {
  return {
    timestamp: new Date().getTime(),
    entityByKey: toKeyValueMap(entities, getKey),
  }
}

export function findEntityByKey(entityKey: EntityKey, entitySet: EntitySet<{}>) {
  if (!entitySet) { return undefined; }
  return entitySet.entityByKey[entityKey.toStringKey()];
}

export function getEntities<T>(entitySet: EntitySet<T>): T[] {
  if (!entitySet) { return []; }
  return Object.keys(entitySet.entityByKey).map((key) => entitySet.entityByKey[key].data);
}

export function getChildrenByType<T>(entityData: EntityData<T>, entityType: EntityType) {
  if (!entityData.children) { return []; }
  const entitySet = entityData.children.entitySetByType[entityType];
  if (!entitySet) { return []; }
  return getEntities(entitySet);
}

export interface EntityState {
  entitySetByType: EntitySetByType;
}

const initialState: EntityState = {
  entitySetByType: {}
};

function toKeyValueMap<T>(data: T|T[], getKey: GetKey<T>): EntityByKey<T> {
  if (Array.isArray(data)) {
    const result = {};
    for (const entity of data) {
      result[getKey(entity).toStringKey()] = new EntityData(entity);
    }
    return result;
  }
  return null;
}

function updateEntitySet(entitySet: EntitySet<{}>, entityKey: EntityKey, entityData: EntityData<{}>): EntitySet<{}> {
  return {
    ...entitySet,
    entityByKey: {
      ...entitySet.entityByKey,
      [entityKey.toStringKey()]: entityData
    }
  };
}

enum UpdateType {
  REPLACE_ENTITY_SET,
  ADD_ENTITY,
  DELETE_ENTITY
}

interface UpdateWith {
  updateType: UpdateType;
  entitySetByType?: EntitySetByType;
  entityKey?: EntityKey;
  data?: {};
}

function replaceEntitySet(entityState: EntityState, updateWith: UpdateWith) {
  return {
    ...entityState, 
    entitySetByType: {
      ...entityState.entitySetByType,
      ...updateWith.entitySetByType
    }
  }
}

function addEntityToSet(entityState: EntityState, updateWith: UpdateWith) {
  let entitySet = entityState.entitySetByType[updateWith.entityKey.type];
  if (!entitySet) {
    entitySet = {
      timestamp: new Date().getTime(),
      entityByKey: {}
    }
  }
  entitySet = {
    ...entitySet,
    entityByKey: {
      ...entitySet.entityByKey,
      [updateWith.entityKey.toStringKey()]: new EntityData(updateWith.data)
    }
  }
  return {
    ...entityState,
    entitySetByType: {
      ...entityState.entitySetByType,
      [updateWith.entityKey.type]: entitySet
    }
  }
}

function deleteEntityFromSet(entityState: EntityState, updateWith: UpdateWith) {
  const entitySet = entityState.entitySetByType[updateWith.entityKey.type];
  if (!entitySet) { throw new Error(`${updateWith.entityKey.type} not found`); }
  const entityByKey = {...entitySet.entityByKey};
  delete entityByKey[updateWith.entityKey.toStringKey()];
  return {
    ...entityState,
    entitySetByType: {
      ...entityState.entitySetByType,
      [updateWith.entityKey.type]: {
        ...entitySet,
        entityByKey
      }
    }
  }
}

function updateEntityState(entityState: EntityState, path: EntityKey[], updateWith: UpdateWith): EntityState {
  if (!entityState) {
    entityState =  {
      entitySetByType: {}
    };
  }
  if (!path.length) {
    switch (updateWith.updateType) {
      case UpdateType.REPLACE_ENTITY_SET: return replaceEntitySet(entityState, updateWith);
      case UpdateType.ADD_ENTITY: return addEntityToSet(entityState, updateWith);
      case UpdateType.DELETE_ENTITY: return deleteEntityFromSet(entityState, updateWith);
    }
  } else {
    const entityKey = path[0];
    const entitySet = entityState.entitySetByType[entityKey.type];
    if (!entitySet) { throw new Error(`${entityKey.type} not found`); }
    const entity = entitySet.entityByKey[entityKey.toStringKey()];
    if (!entity) { throw new Error(`${entityKey} not found`); }
    const newEntityData = {
      ...entity,
      children: updateEntityState(entity.children, path.slice(1), updateWith)
    }
    return {
      ...entityState,
      entitySetByType: {
        ...entityState.entitySetByType,
        [entityKey.type]: updateEntitySet(entitySet, entityKey, newEntityData)
      }
    }
  }
}

export function entityReducer(state: EntityState = initialState, action: EntityActionUnion): EntityState {
  switch (action.type) {
    case EntityActionTypes.QUERY_ENTITIES:
      return state;
    case EntityActionTypes.ENTITY_SUCCESS:
      if (action.forAction instanceof QueryEntities) {
        const entitySetByType = {
          [action.forAction.entityType.toString()]:
            createEntitySet(action.payload, getKeyFactory(action.forAction.entityType))
        };
        return updateEntityState(state, action.forAction.options.path || [], {
          updateType: UpdateType.REPLACE_ENTITY_SET,
          entitySetByType
        });
      } else if (action.forAction instanceof GetEntity ||
                 action.forAction instanceof CreateEntity || 
                 action.forAction instanceof UpdateEntity) {
        return updateEntityState(state, action.forAction.options.path || [], {
          updateType: UpdateType.ADD_ENTITY,
          entityKey: getKeyFactory(action.forAction.entityType)(action.payload),
          data: action.payload
        });
      } else if (action.forAction instanceof DeleteEntity) {
        return updateEntityState(state, action.forAction.options.path || [], {
          updateType: UpdateType.DELETE_ENTITY,
          entityKey: getKeyFactory(action.forAction.entityType)(action.payload),
          data: action.payload
        });
      }
    default:
      return state;
  }
}

export const getEntityState = createFeatureSelector<EntityState>(ENTITY_STATE);

