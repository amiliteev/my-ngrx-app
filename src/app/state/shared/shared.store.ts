import {Action, Effect, ofAction, Store} from 'ngrx-actions';
import {RequestAction, RequestSuccess, UiEvent, UiEventAction, RequestFailure, ShowSnackBar} from './shared.actions';
import {filterFirst} from '../../misc.utils';
import { FetchProductLinks, UpdateProductLink, DeleteProductLink, CreateProductLink } from '../config/config.actions';
import { FetchGaAccountHeaders, FetchGaProperties } from '../analytics/analytics.actions';
import {of} from 'rxjs';


export interface SharedState {
  actionsProcessing: string[];
  uiEvent?: UiEvent;
}

const DEFAULTS: SharedState = {
  actionsProcessing: [],
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

  @Effect(RequestFailure)
  handleRequestFailure(state: SharedState, action: RequestFailure) {
    return of(new UiEventAction(new ShowSnackBar("Server error.", action.forAction)));
  }

}
