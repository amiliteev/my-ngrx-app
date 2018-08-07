import { Actions, ofType } from "@ngrx/effects";
import { Observable, of } from "rxjs";
import { Action, Store } from "@ngrx/store";
import { mergeMap, switchMap, catchError, withLatestFrom } from "rxjs/operators";
import { RequestAction, RequestResult, RequestFailure, WithPayload, NO_ACTION } from "../shared/shared.actions";
import { AppState } from "../../app.module";

export class CommonEffects {

  constructor (protected readonly actions$: Actions, protected readonly store$: Store<AppState>) {}

  // list<T>(actionType: string, listFunc: (action?: Action) => Observable<T[]>, 
  //   SuccessAction: {new (response: T[])}): Observable<Action> 
  // {
  //   return this.actions$.pipe(
  //     ofType(actionType),
  //     mergeMap((action: RequestAction & WithPostAction) => listFunc(action).pipe(
  //       switchMap(res => 
  //         of(new RequestSuccess(action), 
  //            new SuccessAction(res),
  //            (isWithPostAction(action) ? action.postAction.onSuccess : NO_ACTION))),
  //       catchError(() => of(new RequestFailure(action))))));
  // }

  // modify<T>(actionType: string, updateFunc: (payload: T) => Observable<T>,
  //   SuccessAction: {new (response: T)}): Observable<Action>
  // {
  //   return this.actions$.pipe(
  //     ofType(actionType),
  //     mergeMap((action: RequestAction & WithPostAction & WithPayload<T>) => 
  //       updateFunc(action.payload).pipe(
  //         switchMap(res => 
  //           of(new RequestSuccess(action), 
  //              new SuccessAction(res),
  //              (isWithPostAction(action) ? action.postAction.onSuccess : NO_ACTION))))));
  // }

  mapAction(actionType: string, mapFunc: (action: Action, state: AppState) => Observable<Action>) {
    return this.actions$.pipe(
      ofType(actionType),
      withLatestFrom(this.store$),
      mergeMap(([action, state]) => mapFunc(action, state))
    );
  }
  
}