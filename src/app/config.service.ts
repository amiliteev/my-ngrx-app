import {Injectable} from '@angular/core';
import {Observable, of, throwError, empty} from 'rxjs';
import {LinkType, ProductLink} from './api/protos';
import {randomDelay} from './misc.utils';
import { tap } from 'rxjs/operators';

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
    if (Math.random() < 0.499) return throwError('Service error'); 
    return of([...productLinks]).pipe(randomDelay(), tap(x => console.log('received product link')));
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

  createProductLink(productLink: ProductLink): Observable<ProductLink> {
    productLinks.push(productLink);
    return of(productLink).pipe(randomDelay());
  }

  doNothingWithDelay(): Observable<void> {
    return of(undefined).pipe(randomDelay());
  }

}
