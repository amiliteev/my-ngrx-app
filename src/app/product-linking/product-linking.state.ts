import { createFeatureSelector, createSelector } from "@ngrx/store";
import { getGaProperties, getGaAccountHeaders } from "../state/analytics/analytics.reducer";
import { GaProperty, GaAccountHeader } from "../api/protos";

export const PRODUCT_LINKING_STATE = 'view:product-linking';

export enum ProductLinkingActionTypes {
  SELECT_ACCOUNT = 'SelectAccount'
}

export interface ProductLinkingState {
  selectedAccountId?: number;
}

export type ProductLinkingActionUnion = SelectAccount;

export class SelectAccount {
  readonly type: ProductLinkingActionTypes.SELECT_ACCOUNT = ProductLinkingActionTypes.SELECT_ACCOUNT;
  constructor(readonly accountId: number) {}
}

export function productLinkingReducer(
  state: ProductLinkingState = {}, action: ProductLinkingActionUnion): ProductLinkingState 
{
  switch (action.type) {
    case ProductLinkingActionTypes.SELECT_ACCOUNT:
      return {
        ...state,
        selectedAccountId: action.accountId
      };
    default:
      return state;
  }
}

export const getProductLinkingState = createFeatureSelector<ProductLinkingState>(PRODUCT_LINKING_STATE);

export const getSelectedAccountId = createSelector(getProductLinkingState, 
  (state: ProductLinkingState) => state.selectedAccountId);

export const getGaPropertiesForSelectedAccount = 
  createSelector(getSelectedAccountId, getGaAccountHeaders, getGaProperties,
    (selectedAccountId: number, gaAccountHeaders: GaAccountHeader[], gaProperties: Map<number, GaProperty>) => 
  {
    console.log('gaPropertiesForSelectedAccount');
    if (!selectedAccountId) { return []; }
    const account = gaAccountHeaders.find(
      (account) => account.accountId === selectedAccountId);
    if (!account) { return []; }
    return account.propertyIds.reduce(
      (result, propertyId) => [...result, gaProperties.get(propertyId)], [])
      .filter((property) => property);
  });
    