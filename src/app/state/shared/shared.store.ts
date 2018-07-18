import {Action, Effect, ofAction, Store} from 'ngrx-actions';
import {RequestAction, RequestSuccess, UiEvent, UiEventAction, RequestFailure, ShowSnackBar, MultiAction, UnregisterFromMultiAction} from './shared.actions';
import {filterFirst} from '../../misc.utils';
import { FetchProductLinks, UpdateProductLink, DeleteProductLink, CreateProductLink } from '../config/config.actions';
import { FetchGaAccountHeaders, FetchGaProperties } from '../analytics/analytics.actions';
import {of, empty} from 'rxjs';


export interface SharedState {
  actionsProcessing: string[];
  uiEvent?: UiEvent;
  multiActions: {type: string}[];
}

const DEFAULTS: SharedState = {
  actionsProcessing: [],
  multiActions: [],
};

@Store<SharedState>(DEFAULTS)
export class SharedStore {

  @Action(FetchProductLinks, UpdateProductLink, DeleteProductLink, CreateProductLink,
          FetchGaAccountHeaders, FetchGaProperties)
  startActionProcessing(state: SharedState, action: RequestAction) {
    // console.log('about to make request...');
    return {
      ...state,
      actionsProcessing: [...state.actionsProcessing, action.type]
    };
  }

  @Action(RequestSuccess, RequestFailure)
  finishActionProcessing(state: SharedState, action: RequestSuccess|RequestFailure) {
    // console.log('request successful.');
    return {
      ...state,
      actionsProcessing: filterFirst(state.actionsProcessing, (s) => s === action.forAction.type)
    };
  }

  @Action(UiEventAction)
  handleUiEvent(state: SharedState, action: UiEventAction) {
    return {
      ...state,
      uiEvent: action.uiEvent
    };
  }

  @Action(MultiAction)
  registerMultiAction(state: SharedState, action: MultiAction) {
    return {
      ...state,
      multiActions: [...state.multiActions, ...action.actions],
    };
  }

  @Effect(RequestFailure)
  handleRequestFailure(state: SharedState, action: RequestFailure) {
    return of(new UiEventAction(new ShowSnackBar("Server error.", action.forAction)));
  }

  @Action(UnregisterFromMultiAction)
  unregisterFromMultiAction(state: SharedState, action: UnregisterFromMultiAction) {
    return {
      ...state,
      multiActions: filterFirst(state.multiActions, (elem) => elem === action.action)
    };
  }

  @Effect(UnregisterFromMultiAction)
  checkRemainingActions(state: SharedState, action: UnregisterFromMultiAction) {
    if (action.multiAction.actions.every((elem) => !state.multiActions.includes(elem))) {
      return of(action.multiAction.postAction.onSuccess);
    } else {
      return empty();
    }
  }

  @Effect(MultiAction)
  dispatchMultiAction(state: SharedState, multiAction: MultiAction) {
    const actions = multiAction.actions.map((action) => (
      {...action, postAction: new UnregisterFromMultiAction(multiAction, action)}));
    return of(...actions);
  }

}
