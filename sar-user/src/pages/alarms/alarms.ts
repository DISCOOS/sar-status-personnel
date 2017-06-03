import { ViewChild, Component, OnInit, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SARService } from '../../services/sar.service';
import { Mission, SARUser, Alarm } from '../../models/models';
import { Http, Response, RequestOptions } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { Expense } from '../expense/expense';
import { AuthService } from '../../services/auth.service';
import { ExceptionService } from '../../services/exception.service';
import { TabsPage } from '../tabs/tabs';
import { Login } from '../login/login';
import {MissionSinglePage } from "../mission-single/mission-single";

@Component({
  selector: 'page-alarms',
	templateUrl: 'alarms.html'
})

export class Alarms {
	alarmType : string;
	missions : any;
	user: SARUser;

  constructor(
    public navCtrl: NavController, 
    private SARService: SARService,
		private AuthService: AuthService,
		private ExceptionService: ExceptionService,
	) {}

	showExpensePage(missId: number) {
    this.navCtrl
			.push(Expense, { missionId: missId })
			.catch(error => { console.log(error) });
	}

	pushMission(id: number) {
		    this.navCtrl
			.push(MissionSinglePage, { id: id })
			.catch(error => { console.log(error) });
	}

	sortAlarms() {
		// TODO: Sort alarms
	}

  ngOnInit() {
		this.alarmType = "current"; 
		this.user = this.SARService.getUser();
		this.SARService.getUserAlarms(this.user.id)
			.subscribe(
				res => { this.missions = res; },
				error => {
					this.navCtrl.push(TabsPage)
						.catch(error => {
							console.log(error);
							this.ExceptionService.expiredSessionError();
							this.navCtrl.push(Login);	
						})
				});
	}

	ionViewCanEnter() {
    return this.AuthService.isLoggedIn();
  }
}
