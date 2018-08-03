import { ProductLink } from "../../../api/protos";
import { EntityKey, EntityType } from "./common";

export class ProductLinkKey implements EntityKey {
  readonly type = EntityType.PRODUCT_LINK;
  constructor (readonly attributionAccountId: number, 
               readonly externalCustomerId?: number,
               readonly gaPropertyId?: number) {}
  toStringKey() {
    return String(`${this.attributionAccountId},${this.externalCustomerId || this.gaPropertyId}`);
  }
}

export function getProductLinkKey(productLink: ProductLink): ProductLinkKey {
  return new ProductLinkKey(
    productLink.attributionAccountId, productLink.externalCustomerId, productLink.gaPropertyId);
}

