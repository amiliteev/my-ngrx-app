import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Observable, of, empty } from "rxjs";
import { Action, Store } from "@ngrx/store";
import { map, mergeMap, withLatestFrom, filter } from "rxjs/operators";
import { SharedActionTypes, MultiAction, UnregisterFromMultiAction, RequestFailure, UiEventAction, ShowSnackBar } from "./shared.actions";
import { AppState } from "../../app.module";

@Injectable()
export class SharedEffects {

  constructor(readonly store$: Store<AppState>, readonly actions$: Actions) {}

  @Effect()
  multiAction$: Observable<Action>  =
    this.actions$.pipe(
      ofType(SharedActionTypes.MULTI_ACTION),
      mergeMap((multiAction: MultiAction) => {
        const actions = multiAction.actions.map((action) => {
          const newAction = Object.create(action);
          Object.assign(newAction, action);
          newAction.options.onSuccess = new UnregisterFromMultiAction(multiAction, action.uid);
          return newAction;
        });
        return of(...actions);
      })
    );

  @Effect()
  unregisterFromMultiAction$: Observable<Action> =
    this.actions$.pipe(
      ofType<UnregisterFromMultiAction>(SharedActionTypes.UNREGISTER_FROM_MULTI_ACTION),
      withLatestFrom(this.store$),
      mergeMap(([action, state]) => {
        if (action.multiAction.actions.every((elem) => 
              !state.shared.multiActionUids.includes(elem.uid))) {
          return of((action as UnregisterFromMultiAction).multiAction.options.onSuccess);
        } else {
          return empty();
        }
      })
    );

  @Effect()
  requestFailure$: Observable<Action> = 
    this.actions$.pipe(
      ofType(SharedActionTypes.REQUEST_FAILURE),
      map((action: RequestFailure) => 
        new UiEventAction(new ShowSnackBar("Server error", action.forAction)))
    )

}
