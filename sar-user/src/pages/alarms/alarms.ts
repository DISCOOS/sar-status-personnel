import { ViewChild, Component, OnInit, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SARService } from '../../services/sar.service';
import { Mission, SARUser, Alarm } from '../../models/models';
import { Http, Response, RequestOptions } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { Expense } from '../expense/expense';
import { AuthService } from '../../services/auth.service';
import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-alarms',
  templateUrl: 'alarms.html'
})

export class Alarms {
	alarmType : string;
  isLoading: boolean;
	alarm: any;
	alarms: Observable<Alarm[]>;
	activeAlarms: Alarm[];
	inactiveAlarms: Alarm[];
	user: SARUser;
	clickedExpense: number;

  constructor(
    public navCtrl: NavController, 
    private SARService: SARService,
		private AuthService: AuthService,
	) {}

	showExpensePage(missId: number) {
    this.navCtrl
			.push(Expense, { missionId: missId })
			.catch(error => { console.log(error) });
	}

	sortAlarms() {
		this.alarms
	}

  ngOnInit() {
		this.alarmType = "current"; 
		this.user = this.SARService.getUser();
		this.SARService.getUserAlarms(this.user.id)
			.subscribe(
				res => { this.alarms = res; },
				error => {
					console.log(error);
					this.navCtrl.push(TabsPage)
				});
	}

	ionViewCanEnter() {
    return this.AuthService.isLoggedIn();
  }
}
