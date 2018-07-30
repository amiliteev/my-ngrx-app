import {GaAccount, GaAccountHeader, GaProperty} from '../../api/protos';
import { RequestAction, PostAction, WithPostAction, WithPayload } from '../shared/shared.actions';
import { Entity } from '../../misc.utils';
import { Action } from '@ngrx/store';

export enum AnalyticsActionTypes {
  FETCH_GA_ACCOUNT_HEADERS = 'Fetch GA Account Headers',
  FETCH_GA_ACCOUNT_HEADERS_SUCCESS = 'Fetch GA Account Headers Success',
  PRE_FETCH_GA_PROPERTIES = 'Pre-fetch GA Properties',
  FETCH_GA_PROPERTIES = 'Fetch GA Properties',
  FETCH_GA_PROPERTIES_SUCCESS = 'Fetch GA Properties Success',
}

export type AnalyticsActionUnion = FetchGaAccountHeaders | FetchGaAccountHeadersSuccess |
  FetchGaProperties | FetchGaPropertiesSuccess | PreFetchGaProperties;

export class FetchGaAccountHeaders implements RequestAction, WithPostAction {
  readonly type: AnalyticsActionTypes.FETCH_GA_ACCOUNT_HEADERS = AnalyticsActionTypes.FETCH_GA_ACCOUNT_HEADERS;
  constructor (readonly postAction: PostAction) {}
}

export class FetchGaAccountHeadersSuccess {
  readonly type: AnalyticsActionTypes.FETCH_GA_ACCOUNT_HEADERS_SUCCESS = 
    AnalyticsActionTypes.FETCH_GA_ACCOUNT_HEADERS_SUCCESS;
  constructor(readonly gaAccountHeaders: GaAccountHeader[]) {}
}

export class PreFetchGaProperties implements Action {
  readonly type: AnalyticsActionTypes.PRE_FETCH_GA_PROPERTIES = AnalyticsActionTypes.PRE_FETCH_GA_PROPERTIES;
}

export class FetchGaProperties implements RequestAction {
  readonly type: AnalyticsActionTypes.FETCH_GA_PROPERTIES = AnalyticsActionTypes.FETCH_GA_PROPERTIES;
  constructor (readonly propertyIds: number[]) {}
}

export class FetchGaPropertiesSuccess {
  readonly type: AnalyticsActionTypes.FETCH_GA_PROPERTIES_SUCCESS = 
    AnalyticsActionTypes.FETCH_GA_PROPERTIES_SUCCESS;
  constructor(readonly properties: GaProperty[]) {}
}
