import { ViewChild, Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SARService } from '../../services/sar.service';
import { Mission } from '../../models/models';
import { Http, Response, RequestOptions } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { Expense } from '../utlegg/expense';

@Component({
  selector: 'page-alarms',
  templateUrl: 'alarms.html'
})

export class Alarms {
	alarmType : string;
  isLoading: boolean;
	missions : Observable<Mission[]>;

	//missions : Observable<Mission[]>;
  constructor(
    public navCtrl: NavController, 
    private SARService: SARService ) {

    // Setter default alarmtype til pågående alarmutkall
    this.alarmType = "current";
    
  }
	showExpensePage() {
		console.log("alarms.ts: showExpensePage()");
    this.navCtrl.push(Expense);

	}

  getMissions() {
		this.isLoading = true;
		this.SARService.getMissions()
			.subscribe((missions) => { 
				// console.log(missions);
				this.missions = missions; 
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
