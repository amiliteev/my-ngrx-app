import { ProductLink } from "../../api/protos";
import { ConfigActionUnion, ConfigActionTypes } from "./config.actions";
import { createFeatureSelector, createSelector } from "@ngrx/store";

export const CONFIG_STATE = 'config';

export interface ConfigState {
  productLinks: ProductLink[];
}

const initialState: ConfigState = {
  productLinks: []
};

export function configReducer(state: ConfigState = initialState, action: ConfigActionUnion): ConfigState {
  switch (action.type) {
    case ConfigActionTypes.FETCH_PRODUCT_LINKS_SUCCESS:
      return {
        ...state,
        productLinks: action.productLinks,
      };
    case ConfigActionTypes.UPDATE_PRODUCT_LINK_SUCCESS:
      return {
        ...state,
        productLinks: state.productLinks.map(
          (productLink) => productLink.accountId === action.payload.accountId &&
            productLink.externalCustomerId === action.payload.externalCustomerId ? action.payload : productLink),
      };
    case ConfigActionTypes.DELETE_PRODUCT_LINK_SUCCESS:
      return {
        ...state,
        productLinks: state.productLinks.filter(
          (productLink) => productLink.accountId !== action.payload.accountId ||
            productLink.externalCustomerId !== action.payload.externalCustomerId),
        };
    default:
      return state;
  }
}

export const getConfigState = createFeatureSelector<ConfigState>(CONFIG_STATE);

export const getProductLinks = createSelector(getConfigState, 
  (state: ConfigState) => state.productLinks);
  