import {QueryEntities, CreateEntity, UpdateEntity, DeleteEntity, GetEntity} from "../state/entities/entities.actions";
import {getEntityState, EntityState, getEntities} from "../state/entities/entities.reducer";
import {ConfigService} from "../config.service";
import { ProductLink } from "../api/protos";
import { Injectable } from "@angular/core";
import { createSelector, Store } from "@ngrx/store";
import { RequestOptions } from "../state/shared/shared.actions";
import { AppState } from "../app.module";
import { ConfigMethods } from "../state/entities/entities.effects";
import { ProductLinkKey } from "../state/entities/keys/product-link.key";
import { EntityType } from "../state/entities/keys/common";

@Injectable()
export class ProductLinkDao {

  constructor(readonly store: Store<AppState>, readonly configService: ConfigService) {}

  listProductLinks(options: RequestOptions): QueryEntities<ProductLink> {
    return new QueryEntities(EntityType.PRODUCT_LINK, {
      ...options,
      method: ConfigMethods.QUERY_PRODUCT_LINKS,
    });
  }

  getProductLink(key: ProductLinkKey, options: RequestOptions): GetEntity<ProductLink> {
    return new GetEntity(EntityType.PRODUCT_LINK, {
      ...options,
      method: ConfigMethods.GET_PRODUCT_LINK,
      parameters: [key],
    });
  }

  createProductLink(productLink: ProductLink, options: RequestOptions): CreateEntity<ProductLink> {
    return new CreateEntity(EntityType.PRODUCT_LINK, {
      ...options,
      method: ConfigMethods.CREATE_PRODUCT_LINK,
      parameters: [productLink],
    });
  }

  updateProductLink(productLink: ProductLink, options: RequestOptions): UpdateEntity<ProductLink> {
    return new UpdateEntity(EntityType.PRODUCT_LINK, {
      ...options,
      method: ConfigMethods.UPDATE_PRODUCT_LINK,
      parameters: [productLink],
    });
  }

  deleteProductLink(productLink: ProductLink, options: RequestOptions): DeleteEntity<ProductLink> {
    return new DeleteEntity(EntityType.PRODUCT_LINK, {
      ...options,
      method: ConfigMethods.DELETE_PRODUCT_LINK,
      parameters: [productLink],
    });
  }

  static getProductLinks = createSelector(getEntityState, 
    (state: EntityState) => state.entitySetByType[EntityType.PRODUCT_LINK] 
      ? <ProductLink[]>getEntities(state.entitySetByType[EntityType.PRODUCT_LINK]) : []);

}
