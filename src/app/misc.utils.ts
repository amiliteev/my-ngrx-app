import {Observable, of, OperatorFunction} from 'rxjs';
import {delay, tap} from 'rxjs/operators';
import {RequestAction} from './state/global/global.actions';

export function randomDelay<T>(): OperatorFunction<T, T> {
  return delay(Math.floor(Math.random() * 1000));
}

export function filterFirst<T>(array: T[], callbackfn: (val: T) => boolean): T[] {
  const firstIndex = array.findIndex(callbackfn);
  if (firstIndex < 0) { return array; }
  return [...array.slice(0, firstIndex), ...array.slice(firstIndex + 1, array.length)];
}

class TimestampedResponse {
  timestamp: number;
  response: any;
}

export enum Entity {
  PRODUCT_LINK
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
    return of(cachedResponse.response);
  }
  return request$.pipe(tap(response => {
    cache.set(actionAsString, {timestamp: Date.now(), response});
  }));
}
