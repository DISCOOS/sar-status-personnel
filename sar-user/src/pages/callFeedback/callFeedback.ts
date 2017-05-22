import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Mission,  MissionResponse, Alarm, SARUser } from '../../models/models';
import { SARService } from '../../services/sar.service';

@Component({
  selector: 'page-callFeedback',
  templateUrl: 'callFeedback.html'
})

export class CallFeedback {
    feedbackType: string;
    missionResponse: MissionResponse;
    missionId: number;
    alarmId: number;
    arrival: string;

  constructor(public navCtrl: NavController, public SARService: SARService, public params:NavParams) {
    this.feedbackType = params.get("parameter");
    //this.missionId = params.get("missionId");
    //this.alarmId = params.get("alarmId");
  }

  /**
   * Formats data from form and creates MissionRespons-object to be persisted to database.  
   */

  submit() { 
    let alarm = this.SARService.getAlarm(1);
    let user = this.SARService.getUser();
    let missionResponse = new MissionResponse(alarm, user, true, 10, this.arrival, null);
    this.SARService.postMissionResponse(missionResponse);
  }
}
