import { Component, Input, OnInit } from '@angular/core';
import { Mission, Alarm } from "../../models/models";
import { SARService } from "../../services/sar.service";
import { AuthService } from "../../services/auth.service";
import { NavParams } from "ionic-angular";


@Component({
    selector: 'mission-single',
    templateUrl: 'mission-single.html'
})

export class MissionSinglePage {
    private id: any;
    private sub: any;
    public mission: Mission;
    public alarms: Alarm[];

    constructor(
        private SARService: SARService,
        private navParams: NavParams,
        private AuthService: AuthService
    ) { }


  ionViewCanEnter() {
    return this.AuthService.isLoggedIn();
  }

  ionViewDidLoad() {
    this.id = this.navParams.get("id");
    this.SARService.getMission(this.id)
        .subscribe(
            mission => { 
                this.mission = mission;
                this.alarms = mission.alarms; 
            },
            error => { console.log("error getting mission") },
            () => { console.log("got mission") })
    }
}
