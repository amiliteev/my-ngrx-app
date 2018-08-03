import {Injectable} from '@angular/core';
import {Observable, of, throwError, empty} from 'rxjs';
import {LinkType, ProductLink} from './api/protos';
import {randomDelay} from './misc.utils';
import { tap } from 'rxjs/operators';
import { ProductLinkKey } from './state/entities/keys/product-link.key';

const productLinks: ProductLink[] = [
  {
    linkType: LinkType.GA,
    attributionAccountId: 1,
    gaPropertyId: 601264,
    productLinkName: 'Link to GA account',
    enabled: true
  },
  {
    linkType: LinkType.GA,
    attributionAccountId: 1,
    gaPropertyId: 946012,
    productLinkName: 'Link to GA account',
    enabled: false
  },
  {
    linkType: LinkType.ADWORDS,
    attributionAccountId: 1,
    externalCustomerId: 2165,
    productLinkName: 'Link to AdWords account',
    enabled: true
  }

];

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor() { }

  getProductLinks(): Observable<ProductLink[]> {
    if (Math.random() < 0.00499) return throwError('Service error'); 
    return of([...productLinks]).pipe(randomDelay(), tap(x => console.log('received product link')));
  }

  getProductLink(key: ProductLinkKey): Observable<ProductLink> {
    const productLink = productLinks.find((pl) => 
      pl.attributionAccountId === key.attributionAccountId &&
      pl.externalCustomerId === key.externalCustomerId &&
      pl.gaPropertyId === key.gaPropertyId);
    if (!productLink) { return throwError('Product link not found'); }
    return of({...productLink, productLinkName: `${productLink.productLinkName} (x)`})
      .pipe(randomDelay());
  }

  updateProductLink(productLink: ProductLink): Observable<ProductLink> {
    const existingIndex = productLinks.findIndex((el) =>
      el.attributionAccountId === productLink.attributionAccountId &&
      el.gaPropertyId === productLink.gaPropertyId && 
      el.externalCustomerId === productLink.externalCustomerId);
    if (existingIndex >= 0) {
      productLinks[existingIndex] = {...productLink};
    }
    return of(productLink).pipe(randomDelay());
  }

  deleteProductLink(productLink: ProductLink): Observable<ProductLink> {
    const existingIndex = productLinks.findIndex((el) =>
      el.attributionAccountId === productLink.attributionAccountId &&
      el.gaPropertyId === productLink.gaPropertyId && 
      el.externalCustomerId === productLink.externalCustomerId);
    if (existingIndex >= 0) { 
      productLinks.splice(existingIndex, 1);
    }
    return of(productLink).pipe(randomDelay());
  }

  createProductLink(productLink: ProductLink): Observable<ProductLink> {
    productLinks.push({...productLink});
    return of(productLink).pipe(randomDelay());
  }

  doNothingWithDelay(): Observable<void> {
    return of(undefined).pipe(randomDelay());
  }

}
