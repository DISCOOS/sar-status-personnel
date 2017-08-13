import { Component } from '@angular/core';
import { Mission, Alarm, SARUser } from "../../models/models";
import { Expense } from '../expense/expense';
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
    public mission: Mission;
    public alarms: Alarm[];
    public status: any;
    private user: SARUser;

    constructor(
        public navCtrl: NavController,
        private ExceptionService: ExceptionService,
        private SARService: SARService,
        private navParams: NavParams,
        private AuthService: AuthService
    ) {

      this.user = JSON.parse(localStorage.getItem('currentUser'));

    }

    showCallPage() {
        this.navCtrl.push(Call, { missionId: this.mission.id })
            .catch(error => {
                this.ExceptionService.expiredSessionError();
                this.navCtrl.setRoot(Login);
            })
    }

    showExpensePage(missId: number) {
        this.navCtrl
            .push(Expense, { missionId: missId })
            .catch(error => { console.log(error) });
    }

    ionViewCanEnter() {
        return this.AuthService.isLoggedIn();
    }

    ionViewDidEnter() {

        this.id = this.navParams.get("id");
        this.getMission();
    }

    ionViewDidLoad() {
        this.initMap()
    }

    getMission() {
        this.SARService.getMission(this.id)
            .subscribe(mission => {
                  this.mission = mission;
              }, error => {
                  console.log("failed to get mission: " + error);
                  this.navCtrl.pop();
              },
              () => {

                  this.initMap();

                  if(this.mission.isActive) {
                    this.SARService.getUserResponses(this.user.id,
                        this.mission.id).subscribe(responses => {
                        if (responses.length === 0) {
                            this.status = 1;
                        } else {
                          let last = responses.slice(-1).pop();
                          this.status = last.response ? 2 : 3;
                      }
                    });
                  }
                  else {
                      this.status = 4;
                  }
              });
    }

    initMap() {
        if(!this.mission || !this.mission.meetingPoint) {
            return;
        }
        console.log("----inits map------")

        const position = {
            lat: this.mission.meetingPoint.lat,
            lng: this.mission.meetingPoint.lng
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
            title: this.mission.meetingPointNicename,
            position: position
        });
    }

}
