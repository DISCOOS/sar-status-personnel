import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MissionResponse, Alarm, SARUser, Tracking } from '../../models/models';
import { SARService } from '../../services/sar.service';
import { Alarms } from '../alarms/alarms';
import { TabsPage } from '../tabs/tabs';
import { Login } from '../login/login';
import { AuthService } from '../../services/auth.service';
import { GeoService } from '../../services/geo.service';
import { ExceptionService } from '../../services/exception.service';

@Component({
  selector: 'page-callFeedback',
  templateUrl: 'callFeedback.html'
})

export class CallFeedback {
    feedbackType: boolean;
    loading: boolean;
    missionResponse: MissionResponse;
    missionId: number;
    alarmId: number;
    arrival: string;
    tracking: Tracking;
    alarm: Alarm;
    user: SARUser;

  constructor(public navCtrl: NavController, public SARService: SARService, public params:NavParams, private AuthService: AuthService, public GeoService: GeoService, private ExceptionService: ExceptionService) {   
    this.feedbackType = params.get("feedbackType");
    this.missionId = params.get("missionId");
    this.alarmId = params.get("alarmId");

    if(!this.feedbackType) {
      setTimeout(() => {
        this.submit();
      }, 3000)
    }
  }

  /**
   * Formats data from form and creates MissionRespons-object to be persisted to database.
   * @param type user input for type of response true/false
   */

  submit() { 
    this.loading = true;
    this.user = this.SARService.getUser();
    let input = this.arrival;
 
    let missionResponse = new MissionResponse(null, this.missionId, this.user.id, this.feedbackType, new Date(), input, null);

    this.SARService.postMissionResponse(missionResponse)
      .subscribe( res => {
        this.loading = false;
        missionResponse = res;
        
        if(this.feedbackType && this.user.isTrackable) {
          console.log("hit geo2");
          this.GeoService.startTracking(missionResponse.id);
        }

        this.navCtrl.push(Alarms)
          .catch((error) => {
            console.log(error);
            this.ExceptionService.expiredSessionError();
            this.navCtrl.setRoot(Login);
          }); // end catch
      }, (error) => {
        this.loading = false;
        this.navCtrl.push(Alarms);
      }); // end subscribe 
  }

  backButton() {
    this.navCtrl.push(TabsPage)
      .catch((error) => {
        this.ExceptionService.expiredSessionError();
        this.navCtrl.setRoot(Login);
      });
  }

  /**
   * Method for validating user input from form
   * @param input string with raw user input
   * @return escaped string
   */

  private validateInput(input: string) {
    return encodeURI(input);  
  }
  
  ionViewCanEnter() {
    return this.AuthService.isLoggedIn();
  }

  ionViewDidLoad() {
    this.loading = false;
    this.SARService.getAlarm(this.alarmId)
      .subscribe(
        data => { this.alarm = data; }, 
        error => { this.navCtrl.setRoot(TabsPage); })
  }
}
