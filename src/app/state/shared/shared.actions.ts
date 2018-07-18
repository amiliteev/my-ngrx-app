import { Entity } from '../../misc.utils';

export interface PostAction {
  readonly onSuccess?: any;
  readonly onFailure?: any;
}

export const NO_ACTION = {
  type: 'No Action'
}

export class RequestAction {
  readonly entity: Entity;
  readonly type: string;
  readonly cacheable: boolean;
  readonly cacheExpiresInSeconds?: number;
}

export class RequestSuccess {
  type = 'Request Success';
  constructor (readonly forAction: RequestAction) {}
}

export class RequestFailure {
  type = 'Request Failure';
  constructor (readonly forAction: RequestAction) {}
}

export interface UiEvent {
}

export class ShowSnackBar implements UiEvent {
  constructor(readonly message: string, readonly actionOnRetry?: RequestAction) {}
}

export class UiEventAction {
  readonly type = 'UI Event';
  constructor(readonly uiEvent: UiEvent) {}
}

export class MultiAction {
  type = 'Multi Action';
  constructor (readonly actions: {type: string, postAction?: PostAction}[], 
    readonly postAction: PostAction) {}
}

export class UnregisterFromMultiAction {
  type = 'Unregister from multi action';
  constructor (readonly multiAction: MultiAction, readonly action: {type: string}) {}
}