export type GetKey<T> = (entity: T) => EntityKey;

export enum EntityType {
  PRODUCT_LINK = "productLink",
  GA_ACCOUNT_HEADER = "gaAccountHeader",
  GA_PROPERTY = "gaProperty"
}

export interface EntityKey {
  readonly type: EntityType;
  toStringKey(): string;
}

