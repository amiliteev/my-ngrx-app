import { getProductLinkKey } from "./product-link.key";
import { getAccountKey } from "./ga-account-header.key";
import { getPropertyKey } from "./ga-property.key";
import { EntityKey, EntityType, GetKey } from "./common";

const ENTITY_KEY_FACTORY_BY_TYPE: {[entityType: string]: GetKey<{}>} = {
  [EntityType.PRODUCT_LINK]: getProductLinkKey,
  [EntityType.GA_ACCOUNT_HEADER]: getAccountKey,
  [EntityType.GA_PROPERTY]: getPropertyKey
}

export function getKeyFactory(entityType: EntityType): GetKey<{}> {
  return ENTITY_KEY_FACTORY_BY_TYPE[entityType];
}

