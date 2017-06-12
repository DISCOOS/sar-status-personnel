import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SARService } from '../../services/sar.service';
import { SARUser } from '../../models/models';
import { AuthService } from '../../services/auth.service';
import { ExceptionService } from '../../services/exception.service';
import { TabsPage } from '../tabs/tabs';
import { Login } from '../login/login';
import { MissionSinglePage } from "../mission-single/mission-single";

@Component({
	selector: 'page-alarms',
	templateUrl: 'alarms.html'
})

export class Alarms {
	alarmType: string;
	attendantsMissions: any[];
	user: SARUser;

	constructor(
		public navCtrl: NavController,
		private SARService: SARService,
		private AuthService: AuthService,
		private ExceptionService: ExceptionService,
	) {

	}

	pushMission(id: number) {
		this.navCtrl
			.push(MissionSinglePage, { id: id })
			.catch(error => { console.log(error) });
	}

	ionViewDidEnter() {

		// Show current mission/alarms when entering
		this.alarmType = "current";
		console.log("getting missions......")

		this.user = this.SARService.getUser();
		this.SARService.getUserAlarms(this.user.id)
			.subscribe(
			res => {
				this.attendantsMissions = res;
			},
			error => {
				this.gotoLogin();
			});
	}

	ionViewCanEnter() {
		return this.AuthService.isLoggedIn();
	}

	gotoLogin() {
		this.navCtrl.push(TabsPage)
			.catch(error => {
				console.log(error);
				this.ExceptionService.expiredSessionError();
				this.navCtrl.push(Login);
			})
	}
}
