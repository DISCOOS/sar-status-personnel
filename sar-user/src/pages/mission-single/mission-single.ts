import { Component, Input, OnInit } from '@angular/core';
import { Mission, Alarm } from "../../models/models";
import { SARService } from "../../services/sar.service";
import { AuthService } from "../../services/auth.service";
import { NavParams } from "ionic-angular";
import { NavController } from 'ionic-angular';
import { Call } from '../call/call';
import { Login } from '../login/login';
import { ExceptionService } from '../../services/exception.service';

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
        public navCtrl: NavController,
        private ExceptionService: ExceptionService, 
        private SARService: SARService,
        private navParams: NavParams,
        private AuthService: AuthService
    ) { }

    showCallPage() {
        this.navCtrl.push(Call, { missionId: this.mission.id })
            .catch(error => {
                this.ExceptionService.expiredSessionError();
                this.navCtrl.setRoot(Login);
            })
    }

    ionViewCanEnter() {
        return this.AuthService.isLoggedIn();
    }

    ionViewDidLoad() {
        this.id = this.navParams.get("id");
        this.SARService.getMission(this.id)
            .subscribe(
                mission => { 
                    this.mission = mission; 
                },  error => { 
                    console.log("error getting mission");
                    this.navCtrl.pop();
                })
        this.SARService.getAlarms(this.id)
            .subscribe(
                alarms => {
                    this.alarms = alarms;
                }, error => { 
                    console.log("error getting alarms");
                    this.navCtrl.pop();
                }) 
        }
    
}
