import { Component, Input, OnInit } from '@angular/core';
import { Mission } from "../../models/models";
import { SARService } from "../../services/sar.service";
import { NavParams } from "ionic-angular";


@Component({
    selector: 'mission-single',
    templateUrl: 'mission-single.html'
})

export class MissionSinglePage implements OnInit {
    private id: any;
    private sub: any;
    mission: Mission;

    constructor(
        private SARService: SARService,
        private navParams: NavParams
    ) { }

    ngOnInit() {

        this.id = this.navParams.get("id");
        
        this.getMission();
    }


    getMission() {

        this.SARService.getMission(this.id)
            .subscribe(
            mission => { this.mission = mission; },
            error => { console.log("error getting mission") },
            () => { console.log("got mission") })
    }



}
