import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromShared from '../state/shared/shared.reducer';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css']
})
export class ProgressBarComponent implements OnInit {

  // @Select(({shared}) => shared.actionsProcessing)
  // actionsProcessing$: Observable<string[]>;

  activeProgressBars$: Observable<string[]>;

  @Input()
  actions: string[] = [];

  @Input()
  key: '';

  isProcessing$: Observable<boolean>;

  constructor(store: Store<{}>) { 
    // this.isProcessing$ = this.actionsProcessing$.pipe(
    //   map(actionsProcessing => this.actions.some(action => actionsProcessing.includes(action)))
    // );
    this.activeProgressBars$ = store.select(fromShared.getActiveProgressBars);
    this.isProcessing$ = this.activeProgressBars$.pipe(
      map(activeProgressBars => activeProgressBars.includes(this.key))
    );
  }

  ngOnInit() {
  }

}
