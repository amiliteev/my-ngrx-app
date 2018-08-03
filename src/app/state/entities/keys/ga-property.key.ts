import { GaProperty } from "../../../api/protos";
import { EntityKey, EntityType } from "./common";

export class GaPropertyKey implements EntityKey {
  readonly type = EntityType.GA_PROPERTY;
  constructor (readonly propertyId: number) {}
  toStringKey() {
    return String(this.propertyId);
  }
}

export function getPropertyKey(gaProperty: GaProperty): GaPropertyKey {
  return new GaPropertyKey(gaProperty.propertyId);
}

