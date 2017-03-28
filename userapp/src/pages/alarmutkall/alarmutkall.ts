import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-alarmutkall',
  templateUrl: 'alarmutkall.html'
})
export class Alarmutkall {
	alarmType : string;
  constructor(public navCtrl: NavController) {
	// Setter default alarmtype til pågående alarmutkall
    this.alarmType = "current";
  }

}
