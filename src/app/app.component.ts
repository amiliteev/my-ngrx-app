import { Component } from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {Select} from 'ngrx-actions';
import {FetchProductLinks} from './state/global/global.actions';
import {GlobalState} from './state/global/global.store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  @Select((state: GlobalState) => JSON.stringify(state, null, '  ')) state$: Observable<string>;

  constructor(readonly store: Store<{}>) {}

  orderPizza() {
    console.log('ordering');
    this.store.dispatch(new FetchProductLinks());
  }

}
