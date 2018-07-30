import { UiEvent, SharedActionUnion, SharedActionTypes, RequestSuccess, RequestFailure, NoAction, UiEventAction, MultiAction, UnregisterFromMultiAction, RequestActionImpl } from "./shared.actions";
import { filterFirst } from "../../misc.utils";
import { Action, createFeatureSelector, createSelector } from "@ngrx/store";

export const SHARED_STATE = 'shared';

export interface SharedState {
  actionsProcessing: string[];
  uiEvent?: UiEvent;
  multiActions: Action[];
  activeProgressBars: string[];
}

const initialState: SharedState = {
  actionsProcessing: [],
  multiActions: [],
  activeProgressBars: []
};

export function sharedReducer(state: SharedState = initialState, action: SharedActionUnion): SharedState {
  console.log(action);
  if (action['progressBarKey']) {
    return {
      ...state,
      actionsProcessing: [...state.actionsProcessing, action.type],
      activeProgressBars: [...state.activeProgressBars, action['progressBarKey']]
   };
  }
  switch (action.type) {
    case SharedActionTypes.REQUEST_SUCCESS:
    case SharedActionTypes.REQUEST_FAILURE:
      return {
        ...state,
        actionsProcessing: filterFirst(state.actionsProcessing, (s) => s === action.forAction.type),
        activeProgressBars: filterFirst(state.activeProgressBars, (s) => s === action.forAction.progressBarKey)
      };
    case SharedActionTypes.UI_EVENT_ACTION:
      return {
        ...state,
        uiEvent: action.uiEvent
      };
    case SharedActionTypes.MULTI_ACTION:
      return {
        ...state,
        multiActions: [...state.multiActions, ...action.actions],
      };
    case SharedActionTypes.UNREGISTER_FROM_MULTI_ACTION:
      return {
        ...state,
        multiActions: filterFirst(state.multiActions, (elem) => elem === action.action)
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
    