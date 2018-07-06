export interface GaAccountHeader {
  accountName: string;
  accountId: number;
  propertyIds: number[];
}

export interface GaAccount extends GaAccountHeader {
  additionalInfo: any;
}

export interface GaView {
  viewId: number;
  viewName: string;
}

export interface GaProperty {
  accountId: number;
  propertyId: number;
  propertyName: string;
  views: GaView[];
}

export interface GaAdwordsLink {
  propertyId: number;
  externalCustomerId: number;
}

export enum LinkType {
  GA,
  ADWORDS,
}

export interface ProductLink {
  linkType: LinkType;
  accountId?: number;
  externalCustomerId?: number;
  productLinkName: string;
  enabled: boolean;
}
