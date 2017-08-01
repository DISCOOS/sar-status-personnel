import { Component } from '@angular/core';
import { Mission, Alarm } from '../../models/models';
import { NavController, NavParams } from 'ionic-angular';
import { SARService } from '../../services/sar.service';
import { AuthService } from '../../services/auth.service';
import { CallFeedback } from '../callFeedback/callFeedback';
import { Login } from '../login/login';
import { Alarms } from '../alarms/alarms';

@Component({
  selector: 'page-call',
  templateUrl: 'call.html'
})

export class Call {
  mission : Mission;
  isLoading : boolean;
  alarm: Alarm;
  feedback: string;

  constructor(
    public navCtrl: NavController, 
    private SARService: SARService,
    private AuthService: AuthService,
    private navParams: NavParams
  ) {}

  /**
   * Navigates user to callFeedback view after one of the buttons is pushed.
   * @param input Tells the method which of the two buttons were clicked, and passes that data to the next view along wiht missionId and alarmId.
   */

  buttonClick(input: boolean) {
    this.navCtrl.push(CallFeedback, {
      feedbackType: input,
      missionId: this.mission.id,
      alarmId: 1,
    })
    .catch(error => {
      console.log("viewCanEnter: " + error);
      this.SARService.logout();
      this.navCtrl.setRoot(Login);
    });
  }

  ionViewDidLoad() {
		this.SARService.getMission(this.navParams.get("missionId"))
      .subscribe(
        mission => { this.mission = mission; },
        error => { 
          console.log(error);
          this.navCtrl.push(Alarms)
            .catch(navError => {
              console.log(navError);
              this.navCtrl.setRoot(Login);
            })
      })
  }

  ionViewCanEnter() {
    return this.AuthService.isLoggedIn();
  }
}
