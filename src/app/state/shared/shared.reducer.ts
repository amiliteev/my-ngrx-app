import { UiEvent, SharedActionUnion, SharedActionTypes, RequestResult, RequestFailure, NoAction, UiEventAction, MultiAction, UnregisterFromMultiAction, RequestActionImpl, isWithOptions, isRequestResult } from "./shared.actions";
import { filterFirst } from "../../misc.utils";
import { Action, createFeatureSelector, createSelector } from "@ngrx/store";
import { EntityActionTypes, EntityActionUnion } from "../entities/entities.actions";

export const SHARED_STATE = 'shared';

export interface SharedState {
  actionsProcessing: string[];
  uiEvent?: UiEvent;
  multiActionUids: string[];
  activeProgressBars: string[];
}

const initialState: SharedState = {
  actionsProcessing: [],
  multiActionUids: [],
  activeProgressBars: []
};

export function sharedReducer(state: SharedState = initialState, action: SharedActionUnion): SharedState {
  console.log(action);
  if (isWithOptions(action) && action.options.progressBarKey) {
    state = {
      ...state,
      activeProgressBars: [...state.activeProgressBars, action.options.progressBarKey]
    };
  }
  if (isRequestResult(action) && isWithOptions(action.forAction) && action.forAction.options.progressBarKey) {
    state = {
      ...state,
      activeProgressBars: filterFirst(state.activeProgressBars, (s) => s === action.forAction.options.progressBarKey)
    };
  }
  switch (action.type) {
    case SharedActionTypes.UI_EVENT_ACTION:
      return {
        ...state,
        uiEvent: action.uiEvent
      };
    case SharedActionTypes.MULTI_ACTION:
      return {
        ...state,
        multiActionUids: [...state.multiActionUids, ...action.actions.map(action => action.uid)],
      };
    case SharedActionTypes.UNREGISTER_FROM_MULTI_ACTION:
      return {
        ...state,
        multiActionUids: filterFirst(state.multiActionUids, (elem) => elem === action.actionUid)
      };
    default: 
      return state;
  }
}

export const getSharedState = createFeatureSelector<SharedState>(SHARED_STATE);

export const getSharedStateAsStr = createSelector(getSharedState, 
  (state: SharedState) => JSON.stringify(state, null, '  '));

export const getUiEvent = createSelector(getSharedState, 
  (state: SharedState) => state.uiEvent);
  
export const getActiveProgressBars = createSelector(getSharedState, 
  (state: SharedState) => state.activeProgressBars);
    