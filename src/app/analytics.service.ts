import {Injectable} from '@angular/core';
import {GaAccountHeader, GaProperty} from './api/protos';
import {Observable, of} from 'rxjs';
import {randomDelay, cacheHttpRequest} from './misc.utils';

const gaAccountHeaders: GaAccountHeader[] = [
  {
    accountId: 107313,
    accountName: 'GA Account Foo',
    propertyIds: [10001, 10002]
  },
  {
    accountId: 713572,
    accountName: 'GA Account Bar',
    propertyIds: [20001, 20002, 20003]
  }

];

const gaProperties: GaProperty[] = [
  {
    propertyId: 10001,
    accountId: 107313,
    propertyName: 'Foo Website - Register'
  },
  {
    propertyId: 10002,
    accountId: 107313,
    propertyName: 'Foo Website - Subscribe'
  },
  {
    propertyId: 20001,
    accountId: 713572,
    propertyName: 'Bar Website - Register'
  },
  {
    propertyId: 20002,
    accountId: 713572,
    propertyName: 'Bar Website - Add to cart'
  },
  {
    propertyId: 20003,
    accountId: 713572,
    propertyName: 'Bar Website - Checkout'
  },
]

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor() { }

  getMethod() {

  }

  getAccountHeaders(): Observable<GaAccountHeader[]> {
    return cacheHttpRequest('/account-headers', 10, of(gaAccountHeaders).pipe(randomDelay()));
  }

  getAccountProperties(accountId: number): Observable<GaProperty[]> {
    const properties = gaProperties.filter((property) => property.accountId === accountId);
    return cacheHttpRequest(`/accounts/${accountId}/properties`, 10, of(properties).pipe(randomDelay()));
  }

}
