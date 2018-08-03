import { Entity } from '../../misc.utils';
import { Action } from '@ngrx/store';

export enum SharedActionTypes {
  NO_ACTION = 'No Action',
  // REQUEST_SUCCESS = 'Request Success',
  REQUEST_FAILURE = 'Request Failure',
  UI_EVENT_ACTION = 'UI Event',
  MULTI_ACTION = 'Multi Action',
  UNREGISTER_FROM_MULTI_ACTION = 'Unregister Multi',
  POST_ACTION_WRAPPER = 'Post Action Wrapper',
}

export type SharedActionUnion = RequestFailure | UiEventAction | MultiAction | UnregisterFromMultiAction;

export class NoAction implements Action {
  readonly type = SharedActionTypes.NO_ACTION;
}

export const NO_ACTION: NoAction = { type: SharedActionTypes.NO_ACTION }

export interface RequestOptions {
  readonly progressBarKey?: string;
  readonly onSuccess?: Action;
  readonly onFailure?: Action;
}

export interface RequestAction extends Action {
  readonly options?: RequestOptions;
}

export interface WithPayload<T> {
  payload: T;
}

export interface WithOptions extends Action {
  options: RequestOptions;
}

export function isWithOptions(arg: any): arg is WithOptions {
  return arg.options !== undefined;
}

export class RequestActionImpl implements RequestAction {
  readonly type: string;
  readonly progressBarKey?: string;
}

export interface RequestResult extends Action {
  readonly forAction: RequestAction;
}

export function isRequestResult(arg: any): arg is RequestResult {
  return arg.forAction !== undefined;
}

export class RequestFailure implements RequestResult {
  readonly type: SharedActionTypes.REQUEST_FAILURE = SharedActionTypes.REQUEST_FAILURE;
  constructor (readonly forAction: RequestAction) {}
}

export interface UiEvent {
}

export class ShowSnackBar implements UiEvent {
  constructor(readonly message: string, readonly actionOnRetry?: RequestAction) {}
}

export class UiEventAction implements Action {
  readonly type = SharedActionTypes.UI_EVENT_ACTION;
  constructor(readonly uiEvent: UiEvent) {}
}

export class MultiAction implements RequestAction {
  readonly type: SharedActionTypes.MULTI_ACTION = SharedActionTypes.MULTI_ACTION;
  constructor (readonly actions: (RequestAction & ActionWithUid)[], readonly options: RequestOptions) {}
}

export class UnregisterFromMultiAction implements Action {
  readonly type: SharedActionTypes.UNREGISTER_FROM_MULTI_ACTION = SharedActionTypes.UNREGISTER_FROM_MULTI_ACTION;
  constructor (readonly multiAction: MultiAction, readonly actionUid: string) {}
}

export class ActionWithUid {
  readonly uid = Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
}