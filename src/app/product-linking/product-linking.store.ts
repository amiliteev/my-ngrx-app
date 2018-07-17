import {Action, Effect, ofAction, Store} from 'ngrx-actions';
import {filterFirst} from '../misc.utils';
import { GaProperty } from '../api/protos';

export class SelectAccount {
  type = 'ProductLinkingView: Select Account';
  constructor(readonly accountId: number) {}
}

export class SelectProperty {
  type = 'ProductLinkingView: Select Property';
  constructor(readonly property: GaProperty) {}
}

export interface ProductLinkingViewState {
  selectedAccountId?: number;
  selectedProperty?: GaProperty
}

const DEFAULTS: ProductLinkingViewState = {
};

@Store<ProductLinkingViewState>(DEFAULTS)
export class ProductLinkingViewStore {

  @Action(SelectAccount)
  selectAccount(state: ProductLinkingViewState, action: SelectAccount) {
    return {
      ...state,
      selectedAccountId: action.accountId
    };
  }

  @Action(SelectProperty)
  selectProperty(state: ProductLinkingViewState, action: SelectProperty) {
    return {
      ...state,
      selectedProperty: action.property
    };
  }

}
