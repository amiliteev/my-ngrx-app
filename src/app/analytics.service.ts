import {Injectable} from '@angular/core';
import {GaAccountHeader} from './api/protos';
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

const gaProperties = {
  10001: {
    propertyId: 10001,
    accountId: 107313,
    propertyName: 'Foo Website - Register'
  },
  10002: {
    propertyId: 10002,
    accountId: 107313,
    propertyName: 'Foo Website - Subscribe'
  },
  20001: {
    propertyId: 20001,
    accountId: 713572,
    propertyName: 'Bar Website - Register'
  },
  20002: {
    propertyId: 20002,
    accountId: 713572,
    propertyName: 'Bar Website - Add to cart'
  },
  20003: {
    propertyId: 20003,
    accountId: 713572,
    propertyName: 'Bar Website - Checkout'
  },
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor() { }

  getAccountHeaders(): Observable<GaAccountHeader[]> {
    return cacheHttpRequest('/account-headers', 10, of(gaAccountHeaders).pipe(randomDelay()));
  }

  getProperties(propertyIds: number[]) {
    const properties = propertyIds.reduce((result, propertyId) => [...result, gaProperties[propertyId]], []);
    return cacheHttpRequest(`/properties/${JSON.stringify(properties)}`, 10, of(properties).pipe(randomDelay()));
  }

}
