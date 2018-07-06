import {Injectable} from '@angular/core';
import {GaAccountHeader} from './api/protos';
import {Observable, of} from 'rxjs';
import {randomDelay} from './misc.utils';

const gaAccountHeaders: GaAccountHeader[] = [
  {
    accountId: 107313,
    accountName: 'GA Account A',
    propertyIds: []
  },
  {
    accountId: 713572,
    accountName: 'GA Account B',
    propertyIds: []
  }

];

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor() { }

  getAccountHeaders(): Observable<GaAccountHeader[]> {
    return of(gaAccountHeaders).pipe(randomDelay());
  }

}
