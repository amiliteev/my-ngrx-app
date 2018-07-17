import {Observable, of, OperatorFunction, empty, throwError} from 'rxjs';
import {delay, tap, catchError} from 'rxjs/operators';
import {RequestAction} from './state/shared/shared.actions';

export function randomDelay<T>(): OperatorFunction<T, T> {
  return delay(Math.floor(Math.random() * 1000) + 1000);
}

export function filterFirst<T>(array: T[], callbackfn: (val: T) => boolean): T[] {
  const firstIndex = array.findIndex(callbackfn);
  if (firstIndex < 0) { return array; }
  return [...array.slice(0, firstIndex), ...array.slice(firstIndex + 1, array.length)];
}

class TimestampedResponse {
  timestamp: number;
  request$?: Observable<any>;
  response?: any;
}

export enum Entity {
  PRODUCT_LINK,
  GA_ACCOUNT_HEADER,
  GA_PROPERTY
}

const cache = new Map<string, TimestampedResponse>();

function flushEntityCache(entity: Entity) {
  cache.forEach((value, key) => {
    if (JSON.parse(key)['entity'] === entity) {
      cache.delete(key);
    }
  });
}

export function cacheable<T>(action: RequestAction, request$: Observable<T>): Observable<T> {
  if (!action.cacheable) {
    flushEntityCache(action.entity);
  }
  const actionAsString = JSON.stringify(action);
  const cachedResponse = cache.get(actionAsString);
  if (cachedResponse &&
      (Date.now() - cachedResponse.timestamp) / 1000 < action.cacheExpiresInSeconds) {
        if (!cachedResponse.response) {
          console.log('request in progress, returning pending request');
        }
    return cachedResponse.response ? of(cachedResponse.response) : cachedResponse.request$;
  }
  // caching only pending request without response, indicating that request is in progress.
  cache.set(actionAsString, {timestamp: Date.now(), request$});
  return request$.pipe(
    tap(response => {
      cache.set(actionAsString, {timestamp: Date.now(), response});
    }),
    catchError((error) => {
      cache.delete(actionAsString);
      return throwError(error);
    })
 );
  
}
