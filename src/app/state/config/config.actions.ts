import {ProductLink} from '../../api/protos';
import {Entity} from '../../misc.utils';
import { RequestAction, PostAction } from '../shared/shared.actions';

export class FetchProductLinks extends RequestAction {
  static readonly TYPE = 'Fetch Product Links';
  readonly entity = Entity.PRODUCT_LINK;
  readonly type = FetchProductLinks.TYPE;
  readonly cacheable = true;
  readonly cacheExpiresInSeconds = 5;
}

export class FetchProductLinksSuccess {
  readonly type = 'Fetch Product Links Success';
  constructor (readonly productLinks: ProductLink[]) {}
}

export class UpdateProductLink extends RequestAction {
  static readonly TYPE = 'Update Product Link';
  readonly entity = Entity.PRODUCT_LINK;
  readonly type = UpdateProductLink.TYPE;
  readonly cacheable = false;
  constructor (readonly payload: ProductLink) {
    super();
  }
}

export class UpdateProductLinksSuccess {
  readonly type = 'Update Product Link Success';
  constructor (readonly payload: ProductLink) {}
}

export class DeleteProductLink extends RequestAction {
  static readonly TYPE = 'Delete Product Link';
  readonly entity = Entity.PRODUCT_LINK;
  readonly type = DeleteProductLink.TYPE;
  readonly cacheable = false;
  constructor (readonly payload: ProductLink) {
    super();
  }
}

export class DeleteProductLinksSuccess {
  readonly type = 'Delete Product Link Success';
  constructor (readonly payload: ProductLink) {}
}

export class CreateProductLink extends RequestAction {
  static readonly TYPE = 'Create Product Link';
  readonly entity = Entity.PRODUCT_LINK;
  readonly type = CreateProductLink.TYPE;
  readonly cacheable = false;
  constructor (readonly payload: ProductLink, readonly postAction: PostAction) {
    super();
  }
}

export class CreateProductLinksSuccess {
  readonly type = 'Create Product Link Success';
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