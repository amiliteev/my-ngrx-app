import {GaAccount, GaAccountHeader, GaProperty} from '../../api/protos';

export interface AnalyticsState {

  gaAccountHeaders: GaAccountHeader[];
  gaAccounts: GaAccount[];
  gaProperties: GaProperty[];

}
