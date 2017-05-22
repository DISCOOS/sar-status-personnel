import { Component } from '@angular/core';
import { Mission } from '../../models/models';
import { NavController } from 'ionic-angular';
import { SARService } from '../../services/sar.service';
import { Observable } from "rxjs/Observable";
import { CallFeedback } from '../callFeedback/callFeedback';

@Component({
  selector: 'page-call',
  templateUrl: 'call.html'
})

export class Call {
  mission : Mission;
  isLoading : boolean; 

  constructor(public navCtrl: NavController, private SARService: SARService) {
  }

  /**
   * Returns mission from specified Id
   * @param missionId Id of wanted mission
   */

  getMission(missionId?: number) {
    this.isLoading = true;
    this.SARService.getMission(missionId)
			.subscribe((mission) => { 
				this.mission = mission; 
		}, 
    	() => this.stopRefreshing(), 
			() => this.stopRefreshing()); 
	}

  /**
   * Navigates user to callFeedback view after one of the buttons is pushed.
   * @param input Tells the method which of the two buttons were clicked, and passes that data to the next view along wiht missionId.
   */

  buttonClick(input: boolean) {
    if(input) {
      this.navCtrl.push(CallFeedback, {
        parameter: "true",
        // missionId: this.mission.id
      });
    } else if(!input) {
      this.navCtrl.push(CallFeedback, {
        paramater: "false",
        // missionId: this.mission.id
      });
    }
  }

  ngOnInit() {
		this.getMission(1);
	}

  private stopRefreshing() {
		this.isLoading = false;
	}
}
