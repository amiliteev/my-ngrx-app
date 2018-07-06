import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {LinkType, ProductLink} from './api/protos';
import {randomDelay} from './misc.utils';

const productLinks: ProductLink[] = [
  {
    linkType: LinkType.GA,
    accountId: 107313,
    productLinkName: 'Link to GA account',
    enabled: true
  },
  {
    linkType: LinkType.GA,
    accountId: 713572,
    productLinkName: 'Link to GA account',
    enabled: false
  },
  {
    linkType: LinkType.ADWORDS,
    accountId: 835915,
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
    return of([...productLinks]).pipe(randomDelay());
  }

  updateProductLink(productLink: ProductLink): Observable<ProductLink> {
    const existingIndex = productLinks.findIndex((el) =>
      el.accountId === productLink.accountId && el.externalCustomerId === productLink.externalCustomerId);
    if (existingIndex >= 0) {
      productLinks[existingIndex] = productLink;
    }
    return of(productLink).pipe(randomDelay());
  }

  deleteProductLink(productLink: ProductLink): Observable<ProductLink> {
    const existingIndex = productLinks.findIndex((el) =>
      el.accountId === productLink.accountId && el.externalCustomerId === productLink.externalCustomerId);
    if (existingIndex >= 0) {
      productLinks.splice(existingIndex, 1);
    }
    return of(productLink).pipe(randomDelay());
  }


}
