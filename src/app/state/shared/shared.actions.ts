import { Entity } from '../../misc.utils';
import { Action } from '@ngrx/store';

export enum SharedActionTypes {
  NoAction = 'No Action',
  RequestAction = 'Request Action',
  REQUEST_SUCCESS = 'Request Success',
  REQUEST_FAILURE = 'Request Failure',
  UI_EVENT_ACTION = 'UI Event',
  MULTI_ACTION = 'Multi Action',
  UNREGISTER_FROM_MULTI_ACTION = 'Unregister Multi',
  POST_ACTION_WRAPPER = 'Post Action Wrapper',
}

export type SharedActionUnion = NoAction | RequestSuccess | RequestFailure |
  UiEventAction | MultiAction | UnregisterFromMultiAction;

export interface PostAction {
  readonly onSuccess?: any;
  readonly onFailure?: any;
}

export class NoAction implements Action {
  readonly type = SharedActionTypes.NoAction;
}

export const NO_ACTION: NoAction = { type: SharedActionTypes.NoAction }

export interface RequestAction extends Action {
  readonly progressBarKey?: string;
}

export interface WithPayload<T> {
  payload: T;
}

export interface WithPostAction extends Action {
  postAction?: PostAction;
}

export function isWithPostAction(arg: any): arg is WithPostAction {
  return arg.postAction !== undefined;
}

export class RequestActionImpl implements RequestAction {
  readonly type: string;
  readonly progressBarKey?: string;
}

export class RequestSuccess implements Action {
  readonly type: SharedActionTypes.REQUEST_SUCCESS = SharedActionTypes.REQUEST_SUCCESS;
  constructor (readonly forAction: RequestAction) {}
}

export class RequestFailure implements Action {
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

export class MultiAction implements Action {
  readonly type: SharedActionTypes.MULTI_ACTION = SharedActionTypes.MULTI_ACTION;
  constructor (readonly actions: WithPostAction[], readonly postAction: PostAction) {}
}

export class UnregisterFromMultiAction implements Action {
  readonly type: SharedActionTypes.UNREGISTER_FROM_MULTI_ACTION = SharedActionTypes.UNREGISTER_FROM_MULTI_ACTION;
  constructor (readonly multiAction: MultiAction, readonly action: Action) {}
}
