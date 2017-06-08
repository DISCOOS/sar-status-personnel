import { Component } from '@angular/core';
import { Mission, Alarm } from "../../models/models";
import { SARService } from "../../services/sar.service";
import { AuthService } from "../../services/auth.service";
import { NavParams } from "ionic-angular";
import { NavController } from 'ionic-angular';
import { Call } from '../call/call';
import { Login } from '../login/login';
import { ExceptionService } from '../../services/exception.service';


declare var google: any;
let marker: any;
marker = false;

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

    ionViewDidEnter() {
        this.id = this.navParams.get("id");
        this.SARService.getMission(this.id)
            .subscribe(
            mission => {
                this.mission = mission;
            }, error => {
                console.log("error getting mission");
                this.navCtrl.pop();
            },
            () => this.initMap()
            )
        this.SARService.getAlarms(this.id)
            .subscribe(
            alarms => {
                this.alarms = alarms;
            }, error => {
                console.log("error getting alarms");
                this.navCtrl.pop();
            },
            () => this.initMap()
            )


    }

    initMap() {
        console.log(this.mission)
        const position = {

            // lat: 60.3927016,
            lat: this.mission.meetingPoint.lat,
            lng: this.mission.meetingPoint.lng
            //  lng: 5.321656
        }

        const mapOptions = {
            // How zoomed in you want the map to start at (always required)
            zoom: 16,
            // The latitude and longitude to center the map (always required)
            center: position
        };

        // Get the HTML DOM element that will contain map
        const mapElement = document.getElementById('map');

        // Create the Google Map using our element and options defined above
        const map = new google.maps.Map(mapElement, mapOptions);

        // Create a marker for each place.
        marker = new google.maps.Marker({
            map: map,
            title: "Tittel",
            position: position
        });
    }

}
