import { Component } from '@angular/core';
import { Mission } from '../../models/models';
import { NavController } from 'ionic-angular';
import { SARService } from '../../services/sar.service';
import { Observable } from "rxjs/Observable";

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

  ngOnInit() {
		this.getMission(1);
	}

  private stopRefreshing() {
		this.isLoading = false;
	}

  private onclick(input: boolean) {
    if(input) {

    } else {

    }
  }
}
