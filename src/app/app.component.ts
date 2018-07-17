import { Component } from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {Select} from 'ngrx-actions';
import { MatSnackBar } from '@angular/material';
import { UiEvent, ShowSnackBar } from './state/shared/shared.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  @Select(({shared}) => shared.uiEvent)
  uiEvent$: Observable<UiEvent>;

  @Select((state) => JSON.stringify(state, null, '  ')) state$: Observable<string>;

  constructor(readonly store: Store<{}>, readonly snackBar: MatSnackBar) {
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
