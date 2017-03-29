import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-alarms',
  templateUrl: 'alarms.html'
})
export class Alarms {
	alarmType : string;
  constructor(public navCtrl: NavController) {
	// Setter default alarmtype til pågående alarmutkall
    this.alarmType = "current";
  }

}
