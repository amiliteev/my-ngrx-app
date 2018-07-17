import {GaAccount, GaAccountHeader, GaProperty} from '../../api/protos';
import { RequestAction, PostAction } from '../shared/shared.actions';
import { Entity } from '../../misc.utils';

export class FetchGaAccountHeaders extends RequestAction {
  static readonly TYPE = 'Fetch GA Account Headers';
  readonly entity = Entity.GA_ACCOUNT_HEADER;
  readonly cacheable = true;
  readonly cacheExpiresInSeconds = 5;
  readonly type = FetchGaAccountHeaders.TYPE;
  constructor (readonly postAction: PostAction) { super(); }
}

export class FetchGaAccountHeadersSuccess {
  readonly type = 'Fetch GA Account Headers Success';
  constructor(readonly gaAccountHeaders: GaAccountHeader[]) {}
}

export class PreFetchGaProperties extends RequestAction {
  readonly entity = Entity.GA_PROPERTY;
  readonly cacheable = true;
  readonly cacheExpiresInSeconds = 5;
  readonly type = 'Pre-fetch GA Properties';
}

export class FetchGaProperties extends RequestAction {
  static readonly TYPE = 'Fetch GA Properties';
  readonly entity = Entity.GA_PROPERTY;
  readonly cacheable = true;
  readonly cacheExpiresInSeconds = 5;
  readonly type = FetchGaProperties.TYPE;
  constructor (readonly propertyIds: number[]) { super(); }
}

export class FetchGaPropertiesSuccess {
  readonly type = 'Fetch GA Properties Success';
  constructor(readonly properties: GaProperty[]) {}
}

export class FetchGaAccount {
  readonly type = 'Fetch GA Account';
  constructor(readonly accountId: number) {}
}

export class FetchGaAccountSuccess {
  readonly type = 'Fetch GA Account Success';
  constructor(readonly gaAccount: GaAccount) {}
}
