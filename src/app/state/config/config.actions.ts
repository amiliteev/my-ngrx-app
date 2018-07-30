import {ProductLink} from '../../api/protos';
import {Entity} from '../../misc.utils';
import { RequestAction, PostAction, WithPayload } from '../shared/shared.actions';

export enum ConfigActionTypes {
  FETCH_PRODUCT_LINKS = 'Fetch Product Links',
  FETCH_PRODUCT_LINKS_SUCCESS = 'Fetch Product Links Success',
  CREATE_PRODUCT_LINK = 'Create Product Link', 
  CREATE_PRODUCT_LINK_SUCCESS = 'Create Product Link Success', 
  UPDATE_PRODUCT_LINK = 'Update Product Link', 
  UPDATE_PRODUCT_LINK_SUCCESS = 'Update Product Link Success', 
  DELETE_PRODUCT_LINK = 'Delete Product Link', 
  DELETE_PRODUCT_LINK_SUCCESS = 'Delete Product Link Success', 
}

export class FetchProductLinks implements RequestAction {
  readonly type: ConfigActionTypes.FETCH_PRODUCT_LINKS = ConfigActionTypes.FETCH_PRODUCT_LINKS;
}

export class FetchProductLinksSuccess {
  readonly type: ConfigActionTypes.FETCH_PRODUCT_LINKS_SUCCESS = ConfigActionTypes.FETCH_PRODUCT_LINKS_SUCCESS;
  constructor (readonly productLinks: ProductLink[]) {}
}

export class UpdateProductLink implements RequestAction, WithPayload<ProductLink> {
  readonly type: ConfigActionTypes.UPDATE_PRODUCT_LINK = ConfigActionTypes.UPDATE_PRODUCT_LINK;
  constructor (readonly payload: ProductLink) {}
}

export class UpdateProductLinksSuccess implements WithPayload<ProductLink> {
  readonly type: ConfigActionTypes.UPDATE_PRODUCT_LINK_SUCCESS = ConfigActionTypes.UPDATE_PRODUCT_LINK_SUCCESS;
  constructor (readonly payload: ProductLink) {}
}

export class DeleteProductLink implements RequestAction, WithPayload<ProductLink> {
  readonly type: ConfigActionTypes.DELETE_PRODUCT_LINK = ConfigActionTypes.DELETE_PRODUCT_LINK;
  constructor (readonly payload: ProductLink) {}
}

export class DeleteProductLinksSuccess implements WithPayload<ProductLink> {
  readonly type: ConfigActionTypes.DELETE_PRODUCT_LINK_SUCCESS = ConfigActionTypes.DELETE_PRODUCT_LINK_SUCCESS;
  constructor (readonly payload: ProductLink) {}
}

export class CreateProductLink implements RequestAction {
  readonly type: ConfigActionTypes.CREATE_PRODUCT_LINK = ConfigActionTypes.CREATE_PRODUCT_LINK;
  constructor (readonly payload: ProductLink, readonly postAction: PostAction) {}
}

export class CreateProductLinksSuccess {
  readonly type: ConfigActionTypes.CREATE_PRODUCT_LINK_SUCCESS = ConfigActionTypes.CREATE_PRODUCT_LINK_SUCCESS;
  constructor (readonly payload: ProductLink) {}
}

export class ActionA {
  readonly type = 'Action A';
  constructor (readonly postAction?: PostAction) {}
}

export class ActionB {
  readonly type = 'Action B';
  constructor (readonly postAction?: PostAction) {}
}

export type ConfigActionUnion = FetchProductLinks | FetchProductLinksSuccess | 
  CreateProductLink | CreateProductLinksSuccess |
  UpdateProductLink | UpdateProductLinksSuccess | 
  DeleteProductLink | DeleteProductLinksSuccess;
