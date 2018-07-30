import { Component } from '@angular/core';
import {Store, State, select} from '@ngrx/store';
import {Observable} from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { UiEvent, ShowSnackBar } from './state/shared/shared.actions';
import * as fromShared from './state/shared/shared.reducer';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  uiEvent$: Observable<UiEvent>;
  state$: Observable<string>;

  constructor(readonly store: Store<{}>, readonly snackBar: MatSnackBar) {
    this.uiEvent$ = this.store.pipe(select(fromShared.getUiEvent));
    this.state$ = this.store.pipe(select((state) => JSON.stringify(state, null, '  ')));
    //
    this.uiEvent$.subscribe((uiEvent) => this.handleUiEvent(uiEvent));
  }

  private handleUiEvent(uiEvent: UiEvent) {
    if (uiEvent instanceof ShowSnackBar) {
      setTimeout(() => 
        this.snackBar.open(uiEvent.message, uiEvent.actionOnRetry ? "Retry" : null, {duration: 3000})
          .onAction().subscribe(() => this.store.dispatch(uiEvent.actionOnRetry)));
    }
  }
}
