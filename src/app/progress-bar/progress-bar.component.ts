import { Component, OnInit, Input } from '@angular/core';
import { Select } from 'ngrx-actions';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css']
})
export class ProgressBarComponent implements OnInit {

  @Select(({shared}) => shared.actionsProcessing)
  actionsProcessing$: Observable<string[]>;

  @Input()
  actions: string[] = [];

  isProcessing$: Observable<boolean>;

  constructor() { 
    this.isProcessing$ = this.actionsProcessing$.pipe(
      map(actionsProcessing => this.actions.some(action => actionsProcessing.includes(action)))
    );
  }

  ngOnInit() {
  }

}
