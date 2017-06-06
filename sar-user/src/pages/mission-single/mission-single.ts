import { Component, Input, OnInit } from '@angular/core';
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

    ionViewDidLoad() {
        this.id = this.navParams.get("id");
        this.SARService.getMission(this.id)
            .subscribe(
                mission => { 
                    this.mission = mission; 
                },  error => { 
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
                }) 
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
                //styles: [{ "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#e9e9e9" }, { "lightness": 17 }] }, { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }, { "lightness": 20 }] }, { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{ "color": "#ffffff" }, { "lightness": 17 }] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#ffffff" }, { "lightness": 29 }, { "weight": 0.2 }] }, { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }, { "lightness": 18 }] }, { "featureType": "road.local", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }, { "lightness": 16 }] }, { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }, { "lightness": 21 }] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#dedede" }, { "lightness": 21 }] }, { "elementType": "labels.text.stroke", "stylers": [{ "visibility": "on" }, { "color": "#ffffff" }, { "lightness": 16 }] }, { "elementType": "labels.text.fill", "stylers": [{ "saturation": 36 }, { "color": "#333333" }, { "lightness": 40 }] }, { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#f2f2f2" }, { "lightness": 19 }] }, { "featureType": "administrative", "elementType": "geometry.fill", "stylers": [{ "color": "#fefefe" }, { "lightness": 20 }] }, { "featureType": "administrative", "elementType": "geometry.stroke", "stylers": [{ "color": "#fefefe" }, { "lightness": 17 }, { "weight": 1.2 }] }]
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
