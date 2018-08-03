import { GaAccountHeader } from "../../../api/protos";
import { EntityKey, EntityType } from "./common";

export class GaAccountHeaderKey implements EntityKey {
  readonly type = EntityType.GA_ACCOUNT_HEADER;
  constructor (readonly accountId: number) {}
  toStringKey() {
    return String(this.accountId);
  }
}

export function getAccountKey(gaAccountHeader: GaAccountHeader): GaAccountHeaderKey {
  return new GaAccountHeaderKey(gaAccountHeader.accountId);
}

