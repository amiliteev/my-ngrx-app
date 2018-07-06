import {ProductLink} from '../../api/protos';
import {Entity} from '../../misc.utils';

export class RequestAction {
  readonly entity: Entity;
  readonly type: string;
  readonly cacheable: boolean;
  readonly cacheExpiresInSeconds?: number;
}

export class RequestSuccess {
  type = 'Request Success';
  constructor (readonly forAction: RequestAction) {}
}

export class FetchProductLinks extends RequestAction {
  readonly entity = Entity.PRODUCT_LINK;
  readonly type = 'Fetch Product Links';
  readonly cacheable = true;
  readonly cacheExpiresInSeconds = 15;
}

export class FetchProductLinksSuccess {
  readonly type = 'Fetch Product Links Success';
  constructor (readonly productLinks: ProductLink[]) {}
}

export class UpdateProductLink extends RequestAction {
  readonly entity = Entity.PRODUCT_LINK;
  readonly type = 'Update Product Link';
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
  readonly entity = Entity.PRODUCT_LINK;
  readonly type = 'Delete Product Link';
  readonly cacheable = false;
  constructor (readonly payload: ProductLink) {
    super();
  }
}

export class DeleteProductLinksSuccess {
  readonly type = 'Delete Product Link Success';
  constructor (readonly payload: ProductLink) {}
}
