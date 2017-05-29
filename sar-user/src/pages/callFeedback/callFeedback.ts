import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Mission,  MissionResponse, Alarm, SARUser } from '../../models/models';
import { SARService } from '../../services/sar.service';

@Component({
  selector: 'page-callFeedback',
  templateUrl: 'callFeedback.html'
})

export class CallFeedback {
    feedbackType: boolean;
    missionResponse: MissionResponse;
    missionId: number;
    alarmId: number;
    arrival: string;

  constructor(public navCtrl: NavController, public SARService: SARService, public params:NavParams) {   
    this.feedbackType = params.get("parameter");
    this.missionId = params.get("missionId");
    this.alarmId = params.get("alarmId");

    if(!this.feedbackType) {
      this.submit();  
    }
  }

  /**
   * Formats data from form and creates MissionRespons-object to be persisted to database.
   * @param type user input for type of response true/false
   */

  submit() { 
    let alarm = this.SARService.getAlarm(this.alarmId);
    let user = this.SARService.getUser();
    let input = this.arrival;
    let missionResponse = new MissionResponse(alarm, user, this.feedbackType, 10, input, null);
    this.SARService.postMissionResponse(missionResponse);
  }

  /**
   * Method for validating user input from form
   * @param input string with raw user input
   * @return escaped string
   */

  private validateInput(input: string) {
    return encodeURI(input);  
  }  
}
