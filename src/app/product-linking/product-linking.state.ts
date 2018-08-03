import { createFeatureSelector, createSelector, Action } from "@ngrx/store";
import { GaProperty, GaAccountHeader } from "../api/protos";
import { AnalyticsDao } from "../dao/analytics.dao";
import { EntitySet, findEntityByKey, getEntities, getChildrenByType } from "../state/entities/entities.reducer";
import { GaAccountHeaderKey } from "../state/entities/keys/ga-account-header.key";
import { EntityType } from "../state/entities/keys/common";
import { RequestAction, RequestOptions, ActionWithUid } from "../state/shared/shared.actions";

export const PRODUCT_LINKING_STATE = 'view:product-linking';

export enum ProductLinkingActionTypes {
  SELECT_ACCOUNT = 'SelectAccount',
  PRE_FETCH_GA_PROPERTIES = 'PreFetch GA Properties',
}

export interface ProductLinkingState {
  selectedAccountKey?: GaAccountHeaderKey;
}

export type ProductLinkingActionUnion = SelectAccount | PreFetchGaProperties;

export class SelectAccount implements Action {
  readonly type: ProductLinkingActionTypes.SELECT_ACCOUNT = ProductLinkingActionTypes.SELECT_ACCOUNT;
  constructor(readonly accountKey: GaAccountHeaderKey) {}
}

export class PreFetchGaProperties implements Action {
  readonly type: ProductLinkingActionTypes.PRE_FETCH_GA_PROPERTIES = 
    ProductLinkingActionTypes.PRE_FETCH_GA_PROPERTIES;
}

export class ActionA extends ActionWithUid implements RequestAction {
  readonly type = 'Action A';
  constructor (readonly options: RequestOptions) {
    super();
  }
}

export class ActionB extends ActionWithUid implements RequestAction {
  readonly type = 'Action B';
  constructor (readonly options: RequestOptions) {
    super();
  }
}

export function productLinkingReducer(
  state: ProductLinkingState = {}, action: ProductLinkingActionUnion): ProductLinkingState 
{
  switch (action.type) {
    case ProductLinkingActionTypes.SELECT_ACCOUNT:
      return {
        ...state,
        selectedAccountKey: action.accountKey
      };
    default:
      return state;
  }
}

export const getProductLinkingState = createFeatureSelector<ProductLinkingState>(PRODUCT_LINKING_STATE);

export const getSelectedAccountKey = createSelector(getProductLinkingState, 
  (state: ProductLinkingState) => state.selectedAccountKey);

export const getGaPropertiesForSelectedAccount = 
  createSelector(getSelectedAccountKey, AnalyticsDao.getGaAccountHeadersEntitySet, 
    (selectedAccountKey: GaAccountHeaderKey, gaAccountHeaders: EntitySet<GaAccountHeader>) => 
{
  console.log('gaPropertiesForSelectedAccount');
  if (!selectedAccountKey) { return []; }
  const accountEntity = findEntityByKey(selectedAccountKey, gaAccountHeaders);
  return <GaProperty[]>getChildrenByType(accountEntity, EntityType.GA_PROPERTY);
});
    