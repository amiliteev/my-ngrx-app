import {GaAccount, GaAccountHeader} from '../../api/protos';

export class FetchGaAccountHeaders {
  readonly type = 'Fetch GA Account Headers';
}

export class FetchGaAccountHeadersSuccess {
  readonly type = 'Fetch GA Account Headers Success';
  constructor(readonly gaAccountHeaders: GaAccountHeader[]) {}
}

export class FetchGaAccount {
  readonly type = 'Fetch GA Account';
  constructor(readonly accountId: number) {}
}

export class FetchGaAccountSuccess {
  readonly type = 'Fetch GA Account Success';
  constructor(readonly gaAccount: GaAccount) {}
}

