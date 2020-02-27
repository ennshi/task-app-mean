import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AlertService} from '../../services/alert.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit, OnDestroy {
  @Input() delay = 4000;
  public text = '';
  alertSub: Subscription;
  constructor(public alertService: AlertService) { }

  ngOnInit() {
    this.alertSub = this.alertService.alert$.subscribe( alert => {
      this.text = alert.text;

      const timeout = setTimeout(() => {
        clearTimeout(timeout);
        this.text = '';
      }, this.delay);
    });
  }
  ngOnDestroy() {
    if (this.alertSub) {
      this.alertSub.unsubscribe();
    }
  }
}
