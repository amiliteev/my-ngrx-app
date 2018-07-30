import { GaAccountHeader, GaProperty } from "../../api/protos";
import { AnalyticsActionUnion, AnalyticsActionTypes } from "./analytics.actions";
import { createFeatureSelector, createSelector } from "@ngrx/store";

export const ANALYTICS_STATE = 'analytics';

export interface AnalyticsState {
  gaAccountHeaders: GaAccountHeader[];
  gaProperties: Map<number, GaProperty>;
}

const initialState: AnalyticsState = {
  gaAccountHeaders: [],
  gaProperties: new Map<number, GaProperty>(),
};

export function analyticsReducer(state: AnalyticsState = initialState, action: AnalyticsActionUnion): AnalyticsState {
  switch (action.type) {
    case AnalyticsActionTypes.FETCH_GA_ACCOUNT_HEADERS_SUCCESS:
      return {
        ...state,
        gaAccountHeaders: action.gaAccountHeaders,
      };
    case AnalyticsActionTypes.FETCH_GA_PROPERTIES_SUCCESS:
      return {
        ...state,
        gaProperties: action.properties.reduce(
          (result, property) => result.set(property.propertyId, property), new Map(state.gaProperties))
      };
    default:
      return state;
  }
}

export const getAnalyticsState = createFeatureSelector<AnalyticsState>(ANALYTICS_STATE);

export const getGaAccountHeaders = createSelector(getAnalyticsState, 
  (state: AnalyticsState) => state.gaAccountHeaders);
  
export const getGaProperties = createSelector(getAnalyticsState, 
  (state: AnalyticsState) => state.gaProperties);
    