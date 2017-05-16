import { ViewChild, Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SARService } from '../../services/sar.service';
import { Mission } from '../../models/models';

@Component({
  selector: 'page-alarms',
  templateUrl: 'alarms.html'
})

export class Alarms {
	alarmType : string;
  isLoading: boolean;
	missions: Mission[];

	//missions : Observable<Mission[]>;
	filteredMissions = this.missions;

  constructor(
    public navCtrl: NavController, 
    private SARService: SARService ) {

    this.filteredMissions = this.missions;
    // Setter default alarmtype til pågående alarmutkall
    this.alarmType = "current";
  }

  getMissions() {
		this.isLoading = true;
		this.SARService.getMissions()
			.subscribe(
			(missions) => {
				this.missions = this.filteredMissions = missions;
			},
			() => this.stopRefreshing(),
			() => this.stopRefreshing());
	}

  private stopRefreshing() {
		this.isLoading = false;
	}

  ngOnInit() {
		this.getMissions();
	}
}
